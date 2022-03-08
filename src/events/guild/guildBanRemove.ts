import { GuildBan, MessageEmbed, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';

abstract class GuildBanRemoveListener extends Listener {
	constructor() {
		super({
			name: 'guildBanRemove',
		});
	}

	async run(ban: GuildBan) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (ban.user.partial) await ban.user.fetch();
		if (!ban.guild) return;
		if (!ban.guild.available) return;
		const guild = await this.cobalt.db.getGuild(ban.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		let audit;
		if (ban.guild.me?.permissions.has('VIEW_AUDIT_LOG')) {
			audit = (await ban.guild.fetchAuditLogs()).entries.first();
		}
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(ban.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = ban.user.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor({ name: ban.user.username, iconURL: avatar })
			.setTitle('Member Unbanned')
			.setColor('#118511')
			.setDescription(`**Reason:** ${ban.reason || audit?.reason || 'No reason provided'}`)
			.setFooter({ text: `User ID: ${ban.user.id}` })
			.setTimestamp();
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default GuildBanRemoveListener;
