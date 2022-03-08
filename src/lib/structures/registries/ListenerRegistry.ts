import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/CobaltClient';
import { Listener } from '#lib/structures/listeners';
import { logger } from '../logger';

const registerListener = (cobalt: CobaltClient) => {
	const listenerFiles = sync(resolve(__dirname + '/../../../listeners/**/*'));
	listenerFiles.forEach(file => {
		if (/\.js$/iu.test(file)) {
			const File = require(file).default;
			if (File && File.prototype instanceof Listener) {
				const listener: Listener = new File();
				listener.cobalt = cobalt;
				cobalt.events.set(listener.name, listener);
				cobalt[listener.once ? 'once' : 'on'](listener.name, (...args: any[]) => listener.run(...args));
				logger.info({ listener: { name: listener.name } }, `Registering listener: ${listener.name}`);
			}
		}
	});
};

export default registerListener;
