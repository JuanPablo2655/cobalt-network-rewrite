import { resolve } from 'path';
import { sync } from 'glob';
import { CobaltClient } from '#lib/CobaltClient';
import { GenericCommand } from '#lib/structures/commands';
import { logger } from '..';
import { resloveFile } from '#utils/util';

export async function CommandRegistry(cobalt: CobaltClient) {
	const files = sync(resolve(__dirname + '/../../../commands/**/*.js'));
	for (const file of files) {
		const command = await resloveFile<GenericCommand>(file);
		if (!command) continue;
		command.cobalt = cobalt;
		cobalt.commands.set(command.name, command);
		command.aliases.forEach(alias => cobalt.commands.set(alias, command));
		logger.info({ command: { name: command.name } }, `Registering command: ${command.name}`);
	}
}
