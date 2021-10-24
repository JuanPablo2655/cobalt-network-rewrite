import { CommandInteraction } from 'discord.js';
import { InteractionCommand } from '../../lib/structures';
import { experienceCommand } from './options';
import { rank, reputation } from './subcommands';

abstract class ExperienceInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: experienceCommand.name,
			category: 'experience',
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

export default ExperienceInteractionCommand;
