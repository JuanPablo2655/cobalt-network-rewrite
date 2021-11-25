import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/cobaltClient';
import { Event } from '#lib/structures/events';

const registerEvent: Function = (cobalt: CobaltClient) => {
	const eventFiles = sync(resolve(__dirname + '/../../../events/**/*'));
	console.log(`[Events]\tLoaded ${eventFiles.length} commands`);
	eventFiles.forEach(file => {
		if (/\.(j|t)s$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Event) {
				const event: Event = new File();
				event.cobalt = cobalt;
				cobalt.events.set(event.name, event);
				cobalt[event.type ? 'once' : 'on'](event.name, (...args: any[]) => event.run(...args));
			}
		}
	});
};

export default registerEvent;
