import { sync } from 'glob';
import { resolve } from 'path';
import { CobaltClient } from '#lib/CobaltClient';
import { Listener } from '#lib/structures/listeners';
import { logger } from '../logger';
import { resloveFile } from '#utils/util';

export async function ListenerRegistry(cobalt: CobaltClient) {
	const files = sync(resolve(__dirname + '/../../../listeners/**/*.js'));
	for (const file of files) {
		const listener = await resloveFile<Listener>(file);
		if (!listener) continue;
		listener.cobalt = cobalt;
		cobalt.events.set(listener.name, listener);
		cobalt[listener.once ? 'once' : 'on'](listener.name, (...args: any[]) => listener.run(...args));
		logger.info({ listener: { name: listener.name } }, `Registering listener: ${listener.name}`);
	}
}
