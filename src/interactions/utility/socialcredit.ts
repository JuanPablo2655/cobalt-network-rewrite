import { CommandInteraction } from 'discord.js';
import { InteractionCommand } from '../../lib/structures';
import { socialCreditCommand } from './options';
import { add, check, remove } from './subcommands';

abstract class SocialCreditInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: socialCreditCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: CommandInteraction) {
		const command = interaction.options.getSubcommand(true);
		switch (command) {
			case 'check': {
				await check(this.cobalt, interaction);
				break;
			}
			case 'add': {
				await add(this.cobalt, interaction);
				break;
			}
			case 'remove': {
				await remove(this.cobalt, interaction);
				break;
			}
			default:
				break;
		}
	}
}

export default SocialCreditInteractionCommand;
