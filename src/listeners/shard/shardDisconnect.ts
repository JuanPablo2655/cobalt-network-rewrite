import { CloseEvent, EmbedBuilder, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class ShardDisconnectListener extends Listener {
	constructor() {
		super({
			name: 'shardDisconnect',
		});
	}

	async run(event: CloseEvent, id: number) {
		if (!this.cobalt.testListeners) return;
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new EmbedBuilder()
			.setTitle(`Shard Disconnect`)
			.setDescription(`Shard \`${id}\` disconnected:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardDisconnectListener;
