import { resolve } from 'path';
import { sync } from 'glob';
import { CobaltClient } from '#lib/cobaltClient';
import { GenericCommand } from '#lib/structures/commands';
import { logger } from '..';

const registerCommand: Function = (cobalt: CobaltClient) => {
	const commandFiles = sync(resolve(__dirname + '/../../../commands/**/*'));
	commandFiles.forEach(file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof GenericCommand) {
				const command: GenericCommand = new File();
				command.cobalt = cobalt;
				cobalt.commands.set(command.name, command);
				command.aliases.forEach(alias => cobalt.commands.set(alias, command));
				logger.info({ command: { name: command.name } }, `Registering command: ${command.name}`);
			}
		}
	});
};

export default registerCommand;
