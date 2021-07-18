import { MessageEmbed, Snowflake, WebhookClient } from 'discord.js';
import Event from '../../struct/Event';

abstract class ShardResumeEvent extends Event {
	constructor() {
		super({
			name: 'shardResume',
		});
	}

	async run(id: number, replayedEvents: number) {
		this.cobalt.metrics.eventCounter.labels(this.name).inc();
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient(
			'841886640682958909' as Snowflake,
			'Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS',
		);
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Resume`)
			.setDescription(`Shard \`${id}\` resumed: \`${replayedEvents}\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardResumeEvent;
