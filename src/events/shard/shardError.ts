import { MessageEmbed, WebhookClient } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { config } from '#root/config';

abstract class ShardErrorListener extends Listener {
	constructor() {
		super({
			name: 'shardError',
		});
	}

	async run(error: Error, shardID: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Error`)
			.setDescription(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardErrorListener;
