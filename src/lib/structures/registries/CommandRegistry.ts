import { sync } from 'glob';
import { CobaltClient } from '#lib/CobaltClient';
import { GenericCommand } from '#lib/structures/commands';
import { logger } from '..';
import { resolveFile, validateFile } from '#utils/util';

export async function CommandRegistry(cobalt: CobaltClient) {
	try {
		const files = sync('./dist/commands/**/*.js');
		await Promise.all(files.map(async file => loadCommand(file, cobalt)));
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

async function loadCommand(file: string, cobalt: CobaltClient) {
	const command = await resolveFile<GenericCommand>(file);
	if (!command) return;
	validateFile(file, command);
	command.cobalt = cobalt;
	cobalt.commands.set(command.name, command);
	command.aliases.forEach(alias => cobalt.commands.set(alias, command));
	logger.info({ command: { name: command.name } }, `Registering command: ${command.name}`);
}
