import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/InteractionCommand';
import { socialcreditCommand } from './options';

abstract class SocialCreditInteraction extends Interaction {
	constructor() {
		super({
			name: socialcreditCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: CommandInteraction) {}
}

export default SocialCreditInteraction;
