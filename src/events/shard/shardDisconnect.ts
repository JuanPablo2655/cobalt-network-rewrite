import { CloseEvent, MessageEmbed, Snowflake, WebhookClient } from 'discord.js';
import Event from '../../struct/Event';

abstract class ShardDisconnectEvent extends Event {
	constructor() {
		super({
			name: 'shardDisconnect',
		});
	}

	async run(event: CloseEvent, id: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient(
			'841886640682958909' as Snowflake,
			'Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS',
		);
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Disconnect`)
			.setDescription(`Shard \`${id}\` disconnected:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardDisconnectEvent;
