import { type GuildMember, type TextChannel, EmbedBuilder } from 'discord.js';
import { getOrCreateGuild, getOrCreateMember } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class GuildMemberAddListener extends Listener {
	public constructor() {
		super({
			name: 'guildMemberAdd',
		});
	}

	public async run(member: GuildMember) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (member.partial) await member.fetch();
		if (!member.guild) return;
		if (!member.guild.available) return;
		const user = await getOrCreateMember(member.user.id, member.guild.id);
		if (!user) return;
		const guild = await getOrCreateGuild(member.guild.id);
		if (!guild.log.enabled) return;
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = member.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		if (user.roles.length !== 0) {
			for (const r of user.roles) {
				if (!member.guild.members.me) continue;
				const role = member.guild.roles.cache.get(r);
				if (!role) continue;
				if (member.guild.members.me.roles.highest.comparePositionTo(role) < 0) continue;
				await member.roles.add(role.id);
			}

			return void member.user.send({
				content: `Welcome back **${member.user.username}**, I've given you all of your roles I can give back. If there are some missing, message the staff for the remaining roles.`,
			});
		}

		if (guild.welcome.channelId) {
			const welcomeChannel = this.cobalt.guilds.cache
				.get(member.guild.id)
				?.channels.cache.get(guild.welcome.channelId) as TextChannel;
			const welcome = guild.welcome.message
				.replace('{user.tag}', member.user.tag)
				.replace('{user.username}', member.user.username)
				.replace('{guild.name}', member.guild.name);
			return void welcomeChannel?.send({ content: welcome ?? `Welcome ${member.user.tag}` });
		}

		const created = Math.floor(member.user.createdTimestamp / 100);
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: member.user.username, iconURL: avatar })
			.setTitle(`New Member Joined`)
			.setColor('#118511')
			.setDescription(
				`Registered **<t:${created}:R>** on **<t:${created}:D>** \nGuild Member Count: **${member.guild.memberCount}**`,
			)
			.setFooter({ text: `User ID: ${member.user.id}` })
			.setTimestamp();
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default GuildMemberAddListener;
