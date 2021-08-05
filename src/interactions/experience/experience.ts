import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';
import { experienceOptions } from './options';
import { rank, reputation } from './subcommands';

abstract class ExperienceInteraction extends Interaction {
	constructor() {
		super({
			name: 'experience',
			descrition: 'Experience commands.',
			category: 'experience',
			options: experienceOptions,
		});
	}

	async run(interaction: CommandInteraction) {
		const command = interaction.options.getSubcommand(true);
		switch (command) {
			case 'rank': {
				await rank(this.cobalt, interaction);
				break;
			}
			case 'reputation': {
				await reputation(this.cobalt, interaction);
				break;
			}
			default:
				break;
		}
	}
}

export default ExperienceInteraction;
