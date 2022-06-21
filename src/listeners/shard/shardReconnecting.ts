import { EmbedBuilder, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';
import { logger } from '#lib/structures';

abstract class ShardReconnectingListener extends Listener {
	constructor() {
		super({
			name: 'shardReconnecting',
		});
	}

	async run(id: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Reconnecting`)
			.setDescription(`Shard \`${id}\` is reconnecting!`)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardReconnectingListener;
