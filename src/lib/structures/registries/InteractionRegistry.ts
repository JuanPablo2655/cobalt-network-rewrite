import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/cobaltClient';
import { InteractionCommand } from '#lib/structures/commands';

const registerInteraction: Function = (cobalt: CobaltClient) => {
	const interactionFiles = sync(resolve(__dirname + '/../../../interactions/**/*'));
	let count = 0;
	interactionFiles.forEach(async file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof InteractionCommand) {
				count++;
				const interaction: InteractionCommand = new File();
				interaction.cobalt = cobalt;
				cobalt.interactions.set(interaction.name, interaction);
			}
		}
	});
	console.log(`[Interactions]\tLoaded ${count} commands`);
};

export default registerInteraction;
