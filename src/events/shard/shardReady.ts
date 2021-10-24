import { MessageEmbed, WebhookClient } from 'discord.js';
import { Event } from '../../lib/structures/events';

abstract class ShardReadyEvent extends Event {
	constructor() {
		super({
			name: 'shardReady',
		});
	}

	async run(id: number, unavailableGuilds: Set<string>) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		const cobaltHook = new WebhookClient({ url: process.env.SHARDURL! });
		const shardEmbed = new MessageEmbed().setTitle(`Shard Ready`).setTimestamp();
		if (!unavailableGuilds) {
			shardEmbed.setDescription(`Shard \`${id}\` is connected!`);
		} else {
			shardEmbed.setDescription(
				`Shard \`${id}\` is connected!\n\nThe following guilds are unavailable due to a server outage:\n\`\`\`\n${Array.from(
					unavailableGuilds,
				).join('\n')}\n\`\`\``,
			);
		}
		cobaltHook.send({ embeds: [shardEmbed] });
	}
}

export default ShardReadyEvent;
