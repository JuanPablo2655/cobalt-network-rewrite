import { MessageEmbed, WebhookClient } from 'discord.js';
import { Event } from '../../structures/events';

abstract class ShardErrorEvent extends Event {
	constructor() {
		super({
			name: 'shardError',
		});
	}

	async run(error: Error, shardID: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: process.env.SHARDURL! });
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Error`)
			.setDescription(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardErrorEvent;
