import { globbySync as sync } from 'globby';
import type { CobaltClient } from '#lib/CobaltClient';
import type { InteractionCommand } from '#lib/structures';
import { logger } from '#lib/structures';
import { container } from '#root/Container';
import { resolveFile, validateFile } from '#utils/util';

export async function InteractionRegistry(cobalt: CobaltClient) {
	try {
		const files = sync('./dist/interactions/**/*.js');
		await Promise.all(files.map(async file => loadInteraction(file, cobalt)));
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

async function loadInteraction(file: string, cobalt: CobaltClient) {
	const interaction = await resolveFile<InteractionCommand>(file);
	if (!interaction) return;
	validateFile(file, interaction);
	interaction.cobalt = cobalt;
	container.interactions.set(interaction.name, interaction);
	logger.info({ interaction: { name: interaction.name } }, `Registering interaction: ${interaction.name}`);
}
