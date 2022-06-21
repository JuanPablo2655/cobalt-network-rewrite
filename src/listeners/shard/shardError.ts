import { EmbedBuilder, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';
import { logger } from '#lib/structures';

abstract class ShardErrorListener extends Listener {
	constructor() {
		super({
			name: 'shardError',
		});
	}

	async run(error: Error, shardID: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Error`)
			.setDescription(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardErrorListener;
