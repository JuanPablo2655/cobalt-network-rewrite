import type { ChatInputCommandInteraction } from 'discord.js';
import { experienceCommand } from './options.js';
import { rank, reputation } from './subcommands/index.js';
import { InteractionCommand } from '#lib/structures';

abstract class ExperienceInteractionCommand extends InteractionCommand {
	public constructor() {
		super({
			name: experienceCommand.name,
			category: 'experience',
		});
	}

	public async run(interaction: ChatInputCommandInteraction<'cached'>) {
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
