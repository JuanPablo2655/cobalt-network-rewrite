import { CommandInteraction } from 'discord.js';
import { InteractionCommand } from '../../lib/structures';
import { pingCommand } from './options';

abstract class PingInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: pingCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: CommandInteraction) {
		return interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms` });
	}
}

export default PingInteractionCommand;
