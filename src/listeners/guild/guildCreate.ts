import { type Guild, EmbedBuilder, WebhookClient } from 'discord.js';
import { createGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class GuildCreateListener extends Listener {
	public constructor() {
		super({
			name: 'guildCreate',
		});
	}

	public async run(guild: Guild) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!guild) return;
		if (!guild.available) return;
		await createGuild(guild.id);
		const cobaltHook = new WebhookClient({ url: config.webhooks.guild });
		const guildEmbed = new EmbedBuilder()
			.setTitle(`New Guild Created`)
			.setThumbnail(guild.iconURL({ extension: 'png', forceStatic: false }) ?? '')
			.setDescription(`Guild Name: **${guild.name}**\nGuild ID: **${guild.id}**\nmember: **${guild.memberCount}**`)
			.setFooter({ text: `Now I'm in ${this.cobalt.guilds.cache.size} guilds` })
			.setTimestamp();
		await cobaltHook.send({ embeds: [guildEmbed] });
	}
}

export default GuildCreateListener;
