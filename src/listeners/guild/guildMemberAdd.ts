import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { logger } from '#lib/structures';
import { createMember, createGuild, getGuild, getMember } from '#lib/database';

abstract class GuildMemberAddListener extends Listener {
	constructor() {
		super({
			name: 'guildMemberAdd',
		});
	}

	async run(member: GuildMember) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (member.partial) await member.fetch();
		if (!member.guild) return;
		if (!member.guild.available) return;
		const user =
			(await getMember(member.user.id, member.guild.id)) ?? (await createMember(member.user.id, member.guild.id));
		if (!user) return;
		const guild = (await getGuild(member.guild.id)) ?? (await createGuild(member.guild.id));
		if (!guild) return;
		if (!guild.log?.enabled) return;
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = member.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		if (user.roles.length !== 0) {
			user.roles.forEach(r => {
				if (!member.guild.members.me) return;
				const role = member.guild.roles.cache.get(r);
				if (!role) return;
				if (member.guild.members.me.roles.highest.comparePositionTo(role) < 0) return;
				member.roles.add(role.id);
			});
			return void member.user.send({
				content: `Welcome back **${member.user.username}**, I've give you all of your roles I could give back. If there are some missing, message the staff for the remaining roles.`,
			});
		}
		if (guild.welcome?.channelId) {
			const welcomeChannel = this.cobalt.guilds.cache
				.get(member.guild.id)
				?.channels.cache.get(guild.welcome.channelId) as TextChannel;
			const welcome = guild.welcome.message
				?.replace('{user.tag}', member.user.tag)
				.replace('{user.username}', member.user.username)
				.replace('{guild.name}', member.guild.name);
			return void welcomeChannel.send({ content: welcome ?? `Welcome ${member.user.tag}` });
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
