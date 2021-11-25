import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/cobaltClient';
import { Event } from '#lib/structures/events';

const registerEvent: Function = (cobalt: CobaltClient) => {
	const eventFiles = sync(resolve(__dirname + '/../../../events/**/*'));
	let count = 0;
	eventFiles.forEach(file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Event) {
				count++;
				const event: Event = new File();
				event.cobalt = cobalt;
				cobalt.events.set(event.name, event);
				cobalt[event.type ? 'once' : 'on'](event.name, (...args: any[]) => event.run(...args));
			}
		}
	});
	console.log(`[Events]\tLoaded ${count} events`);
};

export default registerEvent;
