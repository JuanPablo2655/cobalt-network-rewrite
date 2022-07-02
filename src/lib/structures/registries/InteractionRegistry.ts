import { globbySync as sync } from 'globby';
import { CobaltClient } from '#lib/CobaltClient';
import { InteractionCommand } from '#lib/structures/commands';
import { logger } from '#lib/structures';
import { resolveFile, validateFile } from '#utils/util';

export async function InteractionRegistry(cobalt: CobaltClient) {
	try {
		const files = sync('./dist/interactions/**/*.js');
		await Promise.all(files.map(async file => loadInteraction(file, cobalt)));
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

async function loadInteraction(file: string, cobalt: CobaltClient) {
	const interaction = await resolveFile<InteractionCommand>(file);
	if (!interaction) return;
	validateFile(file, interaction);
	interaction.cobalt = cobalt;
	cobalt.container.interactions.set(interaction.name, interaction);
	logger.info({ interaction: { name: interaction.name } }, `Registering interaction: ${interaction.name}`);
}
