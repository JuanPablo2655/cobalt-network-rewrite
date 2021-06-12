import { MessageEmbed, Snowflake, WebhookClient } from 'discord.js';
import Event from '../../struct/Event';

abstract class ShardErrorEvent extends Event {
	constructor() {
		super({
			name: 'shardError',
		});
	}

	async run(error: Error, shardID: number) {
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient(
			'841886640682958909' as Snowflake,
			'Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS',
		);
		const shardEmbed = new MessageEmbed()
			.setTitle(`Shard Error`)
			.setDescription(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``)
			.setTimestamp();
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardErrorEvent;
