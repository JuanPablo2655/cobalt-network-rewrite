import { type CloseEvent, EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { parseWebhooks } from '#root/config';

const webhooks = parseWebhooks();

abstract class ShardDisconnectListener extends Listener {
	public constructor() {
		super({
			name: 'shardDisconnect',
		});
	}

	public async run(event: CloseEvent, id: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: webhooks.shard });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Disconnect`)
			.setDescription(`Shard \`${id}\` disconnected:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``)
			.setTimestamp();
		await cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardDisconnectListener;
