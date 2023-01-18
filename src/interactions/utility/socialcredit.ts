import type { ChatInputCommandInteraction } from 'discord.js';
import { InteractionCommand } from '#lib/structures/commands';
import { socialCreditCommand } from './options.js';
import { add, check, remove } from './subcommands/index.js';

abstract class SocialCreditInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: socialCreditCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: ChatInputCommandInteraction<'cached'>) {
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
