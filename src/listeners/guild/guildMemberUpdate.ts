import { type GuildMember, type Role, type TextChannel, EmbedBuilder } from 'discord.js';
import { addToWallet, getOrCreateGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class GuildMemberUpdateListener extends Listener {
	public constructor() {
		super({
			name: 'guildMemberUpdate',
		});
	}

	public async run(oldMember: GuildMember, newMember: GuildMember) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (oldMember.partial) await oldMember.fetch();
		if (newMember.partial) await newMember.fetch();
		if (!oldMember.guild) return;
		if (!oldMember.guild.available) return;
		const guild = await getOrCreateGuild(newMember.guild.id);
		if (!guild.log.enabled) return;
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache
			.get(newMember.guild.id)
			?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newMember.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: newMember.user.username, iconURL: avatar })
			.setFooter({ text: `User ID: ${newMember.user.id}` })
			.setTimestamp();
		if (oldMember.roles.cache.size < newMember.roles.cache.size) {
			const addedRoles: Role[] = [];
			for (const [_, role] of newMember.roles.cache) {
				if (!oldMember.roles.cache.has(role.id)) addedRoles.push(role);
			}

			logEmbed
				.setTitle('Roles Update')
				.setColor('#2f7db1')
				.setDescription(`Role(s) Added: ${addedRoles.join(', ')}`);
			return void logChannel?.send({ embeds: [logEmbed] });
		}

		if (oldMember.roles.cache.size > newMember.roles.cache.size) {
			const removedRoles: Role[] = [];
			for (const [_, role] of oldMember.roles.cache) {
				if (!newMember.roles.cache.has(role.id)) removedRoles.push(role);
			}

			logEmbed
				.setTitle('Roles Update')
				.setColor('#2f7db1')
				.setDescription(`Role(s) Removed: ${removedRoles.join(', ')}`);
			return void logChannel?.send({ embeds: [logEmbed] });
		}

		if (oldMember.nickname !== newMember.nickname) {
			const oldNick = oldMember.nickname ?? 'None';
			const newNick = newMember.nickname ?? 'None';
			logEmbed
				.setTitle(`Nickname Update`)
				.setColor('#2f7db1')
				.setDescription(`Old Nickname: **${oldNick}**\nNew Nickname: **${newNick}**`);
			return void logChannel?.send({ embeds: [logEmbed] });
		}

		if (!oldMember.premiumSince && newMember.premiumSince) {
			await addToWallet(newMember.user.id, 5_000);
			await newMember.user.send({
				content: `You have boosted **${newMember.guild.name}**, **₡5000** has been added to your wallet!`,
			});
			if (newMember.guild.id === '322505254098698240')
				await newMember.send({
					content: `You have boosted **${newMember.guild.name}**, you also have an additional **4%** multi!`,
				});
			logEmbed.setTitle(`Booster Added`).setColor('#118511');
			return void logChannel?.send({ embeds: [logEmbed] });
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			logEmbed.setTitle(`Booster Removed`).setColor('#8f0a0a');
			return void logChannel?.send({ embeds: [logEmbed] });
		}
	}
}

export default GuildMemberUpdateListener;
