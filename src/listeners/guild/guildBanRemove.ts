import { type GuildBan, type TextChannel, EmbedBuilder } from 'discord.js';
import { getOrCreateGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class GuildBanRemoveListener extends Listener {
	public constructor() {
		super({
			name: 'guildBanRemove',
		});
	}

	public async run(ban: GuildBan) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (ban.user.partial) await ban.user.fetch();
		if (!ban.guild) return;
		if (!ban.guild.available) return;
		const guild = await getOrCreateGuild(ban.guild.id);
		if (!guild.log.enabled) return;
		let audit;
		if (ban.guild.members.me?.permissions.has('ViewAuditLog')) {
			audit = (await ban.guild.fetchAuditLogs()).entries.first();
		}

		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(ban.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = ban.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: ban.user.username, iconURL: avatar })
			.setTitle('Member Unbanned')
			.setColor('#118511')
			.setDescription(`**Reason:** ${ban.reason ?? audit?.reason ?? 'No reason provided'}`)
			.setFooter({ text: `User ID: ${ban.user.id}` })
			.setTimestamp();
		return void logChannel?.send({ embeds: [logEmbed] });
	}
}

export default GuildBanRemoveListener;
