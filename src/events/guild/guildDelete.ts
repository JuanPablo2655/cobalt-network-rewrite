import { Guild, MessageEmbed, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class GuildDeleteListener extends Listener {
	constructor() {
		super({
			name: 'guildDelete',
		});
	}

	async run(guild: Guild) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (!guild) return;
		if (!guild.available) return;
		await this.cobalt.db.removeGuild(guild.id);
		const cobaltHook = new WebhookClient({ url: config.webhooks.guild! });
		const guildEmbed = new MessageEmbed()
			.setTitle(`Guild Deleted`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }) ?? '')
			.setDescription(`Guild Name: **${guild.name}**\nGuild ID: **${guild.id}**\nmember: **${guild.memberCount}**`)
			.setFooter({ text: `Now I'm in ${this.cobalt.guilds.cache.size} guilds` })
			.setTimestamp();
		cobaltHook.send({ embeds: [guildEmbed] });
	}
}

export default GuildDeleteListener;
