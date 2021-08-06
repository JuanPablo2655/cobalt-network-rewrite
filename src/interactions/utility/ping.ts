import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';

abstract class PingInteraction extends Interaction {
	constructor() {
		super({
			name: 'ping',
			descrition: 'check the bot ping',
			category: 'utility',
			devOnly: true,
		});
	}

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms`, ephemeral: true });
	}
}

export default PingInteraction;
