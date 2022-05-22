import { GuildBan, EmbedBuilder, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';

abstract class GuildBanAddListener extends Listener {
	constructor() {
		super({
			name: 'guildBanAdd',
		});
	}

	async run(ban: GuildBan) {
		if (!this.cobalt.testListeners) return;
		if (ban.user.partial) await ban.user.fetch();
		if (!ban.guild) return;
		if (!ban.guild.available) return;
		const guild = await this.cobalt.db.getGuild(ban.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		let audit;
		if (ban.guild.members.me?.permissions.has('ViewAuditLog')) {
			audit = (await ban.guild.fetchAuditLogs()).entries.first();
		}
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(ban.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = ban.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: ban.user.username, iconURL: avatar })
			.setTitle('Member Banned')
			.setColor('#8f0a0a')
			.setDescription(`**Reason:** ${ban.reason || audit?.reason || 'No reason provided'}`)
			.setFooter({ text: `User ID: ${ban.user.id}` })
			.setTimestamp();
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default GuildBanAddListener;
