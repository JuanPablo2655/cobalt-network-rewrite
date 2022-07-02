import { ChatInputCommandInteraction } from 'discord.js';
import { InteractionCommand } from '#lib/structures/commands';
import { pingCommand } from './options.js';

abstract class PingInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: pingCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: ChatInputCommandInteraction<'cached'>) {
		return interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms` });
	}
}

export default PingInteractionCommand;
