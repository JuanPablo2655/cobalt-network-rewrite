import { MessageEmbed, WebhookClient } from 'discord.js';
import { Event } from '#lib/structures/events';
import { config } from '#root/config';

abstract class ShardResumeEvent extends Event {
	constructor() {
		super({
			name: 'shardResume',
		});
	}

	async run(id: number, replayedEvents: number) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: config.webhooks.shard! });
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Resume`)
			.setDescription(`Shard \`${id}\` resumed: \`${replayedEvents}\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardResumeEvent;
