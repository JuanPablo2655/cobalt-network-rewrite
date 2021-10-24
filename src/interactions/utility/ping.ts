import { CommandInteraction } from 'discord.js';
import Interaction from '../../structures/InteractionCommand';
import { pingCommand } from './options';

abstract class PingInteraction extends Interaction {
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

export default PingInteraction;
