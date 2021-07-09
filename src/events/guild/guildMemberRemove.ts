import { GuildMember, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import Event from '../../struct/Event';

abstract class GuildMemberRemoveEvent extends Event {
	constructor() {
		super({
			name: 'guildMemberRemove',
		});
	}

	async run(member: GuildMember) {
		if (!this.cobalt.testEvents) return;
		if (member.partial) await member.fetch();
		if (!member.guild) return;
		if (!member.guild.available) return;
		const user = await this.cobalt.db.getMember(member.user.id, member.guild.id);
		const guild = await this.cobalt.db.getGuild(member.guild.id);
		if (!guild) return;
		if (!guild.logChannel.enabled) return;
		const logChannelId = guild?.logChannel.channelId;
		const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true });
		if (user && member.roles.cache.size !== 0) {
			let roleList: Snowflake[] = member.roles.cache.map(r => r.id);
			await this.cobalt.db.updateMember(member.user.id, member.guild.id, {
				roles: roleList,
			});
		}
		if (guild.leaveMessage.channelId) {
			const leaveChannel = this.cobalt.guilds.cache
				.get(member.guild.id)
				?.channels.cache.get(guild.leaveMessage.channelId) as TextChannel;
			const leave = guild.leaveMessage
				.message!.replace('{user.tag}', member.user.tag)
				.replace('{user.username}', member.user.username)
				.replace('{guild.name}', member.guild.name);
			return void leaveChannel.send({ content: leave });
		}

		const logEmbed = new MessageEmbed()
			.setAuthor(member.user.username, avatar)
			.setTitle(`Member Left`)
			.setColor('#8f0a0a')
			.setDescription(
				`Time in the Server: **${prettyMilliseconds(
					Date.now() - member.guild.joinedTimestamp,
				)}**\nGuild Member Count: **${member.guild.memberCount}**`,
			)
			.setFooter(`User ID: ${member.user.id}`)
			.setTimestamp();
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default GuildMemberRemoveEvent;
