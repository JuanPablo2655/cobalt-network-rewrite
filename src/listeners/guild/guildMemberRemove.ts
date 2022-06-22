import { GuildMember, EmbedBuilder, Snowflake, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { logger } from '#lib/structures';

abstract class GuildMemberRemoveListener extends Listener {
	constructor() {
		super({
			name: 'guildMemberRemove',
		});
	}

	async run(member: GuildMember) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (member.partial) await member.fetch();
		if (!member.guild) return;
		if (!member.guild.available) return;
		const user = await this.cobalt.container.db.getMember(member.user.id, member.guild.id);
		const guild = await this.cobalt.container.db.getGuild(member.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		const logChannelId = guild?.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = member.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		if (user && member.roles.cache.size !== 0) {
			const roleList: Snowflake[] = member.roles.cache.map(r => r.id);
			await this.cobalt.container.db.updateMember(member.user.id, member.guild.id, {
				roles: roleList,
			});
		}
		if (guild.leaveMessage?.channelId) {
			const leaveChannel = this.cobalt.guilds.cache
				.get(member.guild.id)
				?.channels.cache.get(guild.leaveMessage.channelId) as TextChannel;
			const leave = guild.leaveMessage.message
				?.replace('{user.tag}', member.user.tag)
				.replace('{user.username}', member.user.username)
				.replace('{guild.name}', member.guild.name);
			return void leaveChannel.send({ content: leave ?? `${member.user.tag} left the server` });
		}

		const joined = Math.floor((Date.now() - member.guild.joinedTimestamp) / 100);
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: member.user.username, iconURL: avatar })
			.setTitle(`Member Left`)
			.setColor('#8f0a0a')
			.setDescription(
				`Joined **<t:${joined}:R>** on **<t:${joined}:D>**\nGuild Member Count: **${member.guild.memberCount}**`,
			)
			.setFooter({ text: `User ID: ${member.user.id}` })
			.setTimestamp();
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default GuildMemberRemoveListener;
