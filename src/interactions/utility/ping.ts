import type { ChatInputCommandInteraction } from 'discord.js';
import { pingCommand } from './options.js';
import { InteractionCommand } from '#lib/structures';

abstract class PingInteractionCommand extends InteractionCommand {
	public constructor() {
		super({
			name: pingCommand.name,
			category: 'utility',
		});
	}

	public async run(interaction: ChatInputCommandInteraction<'cached'>) {
		return interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms` });
	}
}

export default PingInteractionCommand;
