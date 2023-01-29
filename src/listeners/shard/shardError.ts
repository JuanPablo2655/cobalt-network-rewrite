import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { parseWebhooks } from '#root/config';

const webhooks = parseWebhooks();

abstract class ShardErrorListener extends Listener {
	public constructor() {
		super({
			name: 'shardError',
		});
	}

	public async run(error: Error, shardID: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: webhooks.shard });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Error`)
			.setDescription(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``)
			.setTimestamp();
		await cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardErrorListener;
