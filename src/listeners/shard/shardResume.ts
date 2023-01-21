import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class ShardResumeListener extends Listener {
	public constructor() {
		super({
			name: 'shardResume',
		});
	}

	public async run(id: number, replayedEvents: number) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Resume`)
			.setDescription(`Shard \`${id}\` resumed: \`${replayedEvents}\``)
			.setTimestamp();
		await cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardResumeListener;
