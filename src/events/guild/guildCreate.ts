import { Guild, MessageEmbed, WebhookClient } from 'discord.js';
import { Event } from '../../lib/structures';

abstract class GuildCreateEvent extends Event {
	constructor() {
		super({
			name: 'guildCreate',
		});
	}

	async run(guild: Guild) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (!guild) return;
		if (!guild.available) return;
		await this.cobalt.db.addGuild(guild.id);
		const cobaltHook = new WebhookClient({ url: process.env.GUILDURL! });
		const guildEmbed = new MessageEmbed()
			.setTitle(`New Guild Created`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }) ?? '')
			.setDescription(`Guild Name: **${guild.name}**\nGuild ID: **${guild.id}**\nmember: **${guild.memberCount}**`)
			.setFooter(`Now I'm in ${this.cobalt.guilds.cache.size} guilds`)
			.setTimestamp();
		cobaltHook.send({ embeds: [guildEmbed] });
	}
}

export default GuildCreateEvent;
