import { Interaction } from 'discord.js';
import Event from '../struct/Event';

abstract class InteractionEvent extends Event {
	constructor() {
		super({
			name: 'interactionCreate',
		});
	}

	async run(interaction: Interaction) {
		this.cobalt.metrics.eventInc(this.name);
		if (!interaction.isCommand()) return;
		if (!interaction.command) return;

		const command = this.cobalt.interactions.get(interaction.command.name);

		try {
			await command?.run(interaction);
		} catch (err) {
			console.log(err);
			return interaction.reply({ content: 'An unexpected error occurred' });
		}
	}
}

export default InteractionEvent;
