import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/CobaltClient';
import { Event } from '#lib/structures/events';
import { logger } from '../logger';

const registerEvent: Function = (cobalt: CobaltClient) => {
	const eventFiles = sync(resolve(__dirname + '/../../../events/**/*'));
	eventFiles.forEach(file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Event) {
				const event: Event = new File();
				event.cobalt = cobalt;
				cobalt.events.set(event.name, event);
				cobalt[event.once ? 'once' : 'on'](event.name, (...args: any[]) => event.run(...args));
				logger.info({ event: { name: event.name } }, `Registering event: ${event.name}`);
			}
		}
	});
};

export default registerEvent;
