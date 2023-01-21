import { globbySync as sync } from 'globby';
import type { CobaltClient } from '#lib/CobaltClient';
import type { GenericCommand } from '#lib/structures';
import { logger } from '#lib/structures';
import { container } from '#root/Container';
import { resolveFile, validateFile } from '#utils/util';

export async function CommandRegistry(cobalt: CobaltClient) {
	try {
		const files = sync('./dist/commands/**/*.js');
		await Promise.all(files.map(async file => loadCommand(file, cobalt)));
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

async function loadCommand(file: string, cobalt: CobaltClient) {
	const command = await resolveFile<GenericCommand>(file);
	if (!command) return;
	validateFile(file, command);
	command.cobalt = cobalt;
	container.commands.set(command.name, command);
	for (const alias of command.aliases) container.commands.set(alias, command);
	logger.info({ command: { name: command.name } }, `Registering command: ${command.name}`);
}
