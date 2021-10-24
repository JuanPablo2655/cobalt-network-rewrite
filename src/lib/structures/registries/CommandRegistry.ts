import { resolve } from 'path';
import { sync } from 'glob';
import { CobaltClient } from '../../cobaltClient';
import { GenericCommand } from '../commands';

const registerCommand: Function = (cobalt: CobaltClient) => {
	const commandFiles = sync(resolve(__dirname + '/../../commands/**/*'));
	console.log(`[Commands]\tLoaded ${commandFiles.length} commands`);
	commandFiles.forEach(file => {
		if (/\.(j|t)s$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof GenericCommand) {
				const command: GenericCommand = new File();
				command.cobalt = cobalt;
				cobalt.commands.set(command.name, command);
				command.aliases.forEach(alias => cobalt.commands.set(alias, command));
			}
		}
	});
};

export default registerCommand;
