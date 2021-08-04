import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';
import { economyOptions } from './options';

abstract class PingInteraction extends Interaction {
	constructor() {
		super({
			name: 'economy',
			descrition: 'Economy commands.',
			options: economyOptions,
		});
	}

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms`, ephemeral: true });
	}
}

export default PingInteraction;
