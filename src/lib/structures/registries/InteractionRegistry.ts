import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/CobaltClient';
import { InteractionCommand } from '#lib/structures/commands';
import { logger } from '../logger';

const registerInteraction = (cobalt: CobaltClient) => {
	const interactionFiles = sync(resolve(__dirname + '/../../../interactions/**/*'));
	interactionFiles.forEach(async file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof InteractionCommand) {
				const interaction: InteractionCommand = new File();
				interaction.cobalt = cobalt;
				cobalt.interactions.set(interaction.name, interaction);
				logger.info({ interaction: { name: interaction.name } }, `Registering interaction: ${interaction.name}`);
			}
		}
	});
};

export default registerInteraction;
