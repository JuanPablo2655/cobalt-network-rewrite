import { Guild, EmbedBuilder, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';
import { logger } from '#lib/structures';

abstract class GuildDeleteListener extends Listener {
	constructor() {
		super({
			name: 'guildDelete',
		});
	}

	async run(guild: Guild) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!guild) return;
		if (!guild.available) return;
		await this.cobalt.db.removeGuild(guild.id);
		const cobaltHook = new WebhookClient({ url: config.webhooks.guild! });
		const guildEmbed = new EmbedBuilder()
			.setTitle(`Guild Deleted`)
			.setThumbnail(guild.iconURL({ extension: 'png', forceStatic: false }) ?? '')
			.setDescription(`Guild Name: **${guild.name}**\nGuild ID: **${guild.id}**\nmember: **${guild.memberCount}**`)
			.setFooter({ text: `Now I'm in ${this.cobalt.guilds.cache.size} guilds` })
			.setTimestamp();
		cobaltHook.send({ embeds: [guildEmbed] });
	}
}

export default GuildDeleteListener;
