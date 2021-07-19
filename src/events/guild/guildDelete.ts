import { Guild, MessageEmbed, Snowflake, WebhookClient } from 'discord.js';
import Event from '../../struct/Event';

abstract class GuildDeleteEvent extends Event {
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
		const cobaltHook = new WebhookClient(
			'841886640682958909' as Snowflake,
			'Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS',
		);
		const guildEmbed = new MessageEmbed()
			.setTitle(`Guild Deleted`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }) ?? '')
			.setDescription(`Guild Name: **${guild.name}**\nGuild ID: **${guild.id}**\nmember: **${guild.memberCount}**`)
			.setFooter(`Now I'm in ${this.cobalt.guilds.cache.size} guilds`)
			.setTimestamp();
		cobaltHook.send({ embeds: [guildEmbed] });
	}
}

export default GuildDeleteEvent;
