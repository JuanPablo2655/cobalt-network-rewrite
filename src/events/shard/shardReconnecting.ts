import { MessageEmbed, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class ShardReconnectingListener extends Listener {
	constructor() {
		super({
			name: 'shardReconnecting',
		});
	}

	async run(id: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Reconnecting`)
			.setDescription(`Shard \`${id}\` is reconnecting!`)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardReconnectingListener;
