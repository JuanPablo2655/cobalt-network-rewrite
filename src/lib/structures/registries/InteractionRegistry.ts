import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/CobaltClient';
import { InteractionCommand } from '#lib/structures/commands';
import { logger } from '../logger';
import { resolveFile } from '#utils/util';

export async function InteractionRegistry(cobalt: CobaltClient) {
	const files = sync(resolve(__dirname + '/../../../interactions/**/*.js'));
	for (const file of files) {
		const interaction = await resolveFile<InteractionCommand>(file);
		if (!interaction) continue;
		interaction.cobalt = cobalt;
		cobalt.interactions.set(interaction.name, interaction);
		logger.info({ interaction: { name: interaction.name } }, `Registering interaction: ${interaction.name}`);
	}
}
