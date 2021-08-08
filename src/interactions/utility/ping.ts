import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';

abstract class PingInteraction extends Interaction {
	constructor() {
		super({
			name: 'ping',
			descrition: 'check the bot ping',
			category: 'utility',
			permissions: [
				{
					id: '288703114473635841',
					type: 'USER',
					permission: true,
				},
			],
			defaultPermission: false,
		});
	}

	async run(interaction: CommandInteraction) {
		return interaction.reply({ content: `My ping is ${Math.round(this.cobalt.ws.ping)}ms` });
	}
}

export default PingInteraction;
