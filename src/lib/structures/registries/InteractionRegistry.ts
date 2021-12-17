import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/cobaltClient';
import { InteractionCommand } from '#lib/structures/commands';
import { logger } from '../logger';

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
				logger.info({ interaction: { name: interaction.name } }, `Registering interaction: ${interaction.name}`);
			}
		}
	});
	logger.info({ interaction: { total: count } }, `Loaded ${count} commands`);
};

export default registerInteraction;
