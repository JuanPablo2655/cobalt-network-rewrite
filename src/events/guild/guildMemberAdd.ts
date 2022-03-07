import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '#lib/structures/events';

abstract class GuildMemberAddEvent extends Event {
	constructor() {
		super({
			name: 'guildMemberAdd',
		});
	}

	async run(member: GuildMember) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (member.partial) await member.fetch();
		if (!member.guild) return;
		if (!member.guild.available) return;
		const user = await this.cobalt.db.getMember(member.user.id, member.guild.id);
		const guild = await this.cobalt.db.getGuild(member.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true });
		if (user?.roles?.length !== 0) {
			user?.roles?.forEach(r => {
				if (!member.guild.me) return;
				const role = member.guild.roles.cache.get(r);
				if (!role) return;
				if (member.guild.me.roles.highest.comparePositionTo(role) < 0) return;
				member.roles.add(role.id);
			});
			return void member.user.send({
				content: `Welcome back **${member.user.username}**, I've give you all of your roles I could give back. If there are some missing, message the staff for the remaining roles.`,
			});
		}
		if (guild.welcomeMessage?.channelId) {
			const welcomeChannel = this.cobalt.guilds.cache
				.get(member.guild.id)
				?.channels.cache.get(guild.welcomeMessage.channelId) as TextChannel;
			const welcome = guild.welcomeMessage.message
				?.replace('{user.tag}', member.user.tag)
				.replace('{user.username}', member.user.username)
				.replace('{guild.name}', member.guild.name);
			return void welcomeChannel.send({ content: welcome ?? `Welcome ${member.user.tag}` });
		}

		const created = Math.floor(member.user.createdTimestamp / 100);
		const logEmbed = new MessageEmbed()
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

export default GuildMemberAddEvent;
