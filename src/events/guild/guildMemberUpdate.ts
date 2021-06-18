import { GuildMember, MessageEmbed, Role, TextChannel } from 'discord.js';
import Event from '../../struct/Event';

abstract class GuildMemberUpdateEvent extends Event {
	constructor() {
		super({
			name: 'guildMemberUpdate',
		});
	}

	async run(oldMember: GuildMember, newMember: GuildMember) {
		if (!this.cobalt.testEvents) return;
		if (oldMember.partial) await oldMember.fetch();
		if (newMember.partial) await newMember.fetch();
		if (!oldMember.guild) return;
		if (!oldMember.guild.available) return;
		const guild = await this.cobalt.db.getGuild(newMember.guild.id);
		if (!guild) return;
		if (!guild.logChannel.enabled) return;
		const logChannelId = guild?.logChannel.channelId;
		const logChannel = this.cobalt.guilds.cache
			.get(newMember.guild.id)
			?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newMember.user.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor(newMember.user.username, avatar)
			.setFooter(`User ID: ${newMember.user.id}`)
			.setTimestamp();
		if (oldMember.roles.cache.size < newMember.roles.cache.size) {
			const addedRoles: Role[] = [];
			newMember.roles.cache.forEach(role => {
				if (!oldMember.roles.cache.has(role.id)) addedRoles.push(role);
			});
			logEmbed
				.setTitle('Roles Update')
				.setColor('#2f7db1')
				.setDescription(`Role(s) Added: ${addedRoles.join(', ')}`);
			logChannel.send({ embeds: [logEmbed] });
			return;
		}
		if (oldMember.roles.cache.size > newMember.roles.cache.size) {
			const removedRoles: Role[] = [];
			oldMember.roles.cache.forEach(role => {
				if (!newMember.roles.cache.has(role.id)) removedRoles.push(role);
			});
			logEmbed
				.setTitle('Roles Update')
				.setColor('#2f7db1')
				.setDescription(`Role(s) Removed: ${removedRoles.join(', ')}`);
			logChannel.send({ embeds: [logEmbed] });
			return;
		}
		if (oldMember.nickname !== newMember.nickname) {
			const oldNick = oldMember.nickname || 'None';
			const newNick = newMember.nickname || 'None';
			logEmbed
				.setTitle(`Nickname Update`)
				.setColor('#2f7db1')
				.setDescription(`Old Nickname: **${oldNick}**\nNew Nickname: **${newNick}**`);
			logChannel.send({ embeds: [logEmbed] });
			return;
		}
		if (!oldMember.premiumSince && newMember.premiumSince) {
			await this.cobalt.econ.addToWallet(newMember.user.id, 5000);
			newMember.user.send(`You have boosted **${newMember.guild.name}**, **₡5000** has been added to your wallet!`);
			if (newMember.guild.id === '322505254098698240')
				newMember.send(`You have boosted **${newMember.guild.name}**, you also have an additional **4%** multi!`);
			logEmbed.setTitle(`Booster Added`).setColor('#118511');
			logChannel.send({ embeds: [logEmbed] });
		}
		if (oldMember.premiumSince && !newMember.premiumSince) {
			logEmbed.setTitle(`Booster Removed`).setColor('#8f0a0a');
			logChannel.send({ embeds: [logEmbed] });
		}
	}
}

export default GuildMemberUpdateEvent;
