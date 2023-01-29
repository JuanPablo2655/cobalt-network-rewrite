import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { parseWebhooks } from '#root/config';

const webhooks = parseWebhooks();

abstract class ShardReconnectingListener extends Listener {
	public constructor() {
		super({
			name: 'shardReconnecting',
		});
	}

	public async run(id: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: webhooks.shard });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Reconnecting`)
			.setDescription(`Shard \`${id}\` is reconnecting!`)
			.setTimestamp();
		await cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardReconnectingListener;
