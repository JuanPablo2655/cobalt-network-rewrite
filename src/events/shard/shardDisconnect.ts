import { CloseEvent, MessageEmbed, WebhookClient } from 'discord.js';
import { Event } from '#lib/structures/events';

abstract class ShardDisconnectEvent extends Event {
	constructor() {
		super({
			name: 'shardDisconnect',
		});
	}

	async run(event: CloseEvent, id: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: process.env.SHARDURL! });
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Disconnect`)
			.setDescription(`Shard \`${id}\` disconnected:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardDisconnectEvent;
