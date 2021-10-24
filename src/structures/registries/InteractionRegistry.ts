import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '../../lib/cobaltClient';
import { InteractionCommand } from '../commands';

const registerInteraction: Function = (cobalt: CobaltClient) => {
	const interactionFiles = sync(resolve(__dirname + '/../../interactions/**/*'));
	console.log(`[Interactions]\tLoaded ${interactionFiles.length} commands`);
	interactionFiles.forEach(async file => {
		if (/\.(j|t)s$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof InteractionCommand) {
				const interaction: InteractionCommand = new File();
				interaction.cobalt = cobalt;
				cobalt.interactions.set(interaction.name, interaction);
			}
		}
	});
};

export default registerInteraction;
