import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class ShardReadyListener extends Listener {
	public constructor() {
		super({
			name: 'shardReady',
		});
	}

	public async run(id: number, unavailableGuilds: Set<string>) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new EmbedBuilder().setTitle(`Shard Ready`).setTimestamp();
		if (unavailableGuilds) {
			shardEmbed.setDescription(
				`Shard \`${id}\` is connected!\n\nThe following guilds are unavailable due to a server outage:\n\`\`\`\n${Array.from(
					unavailableGuilds,
				).join('\n')}\n\`\`\``,
			);
		} else {
			shardEmbed.setDescription(`Shard \`${id}\` is connected!`);
		}

		await cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardReadyListener;
