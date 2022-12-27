import { globbySync as sync } from 'globby';
import { CobaltClient } from '#lib/CobaltClient';
import { Listener } from '#lib/structures/listeners';
import { logger } from '#lib/structures';
import { resolveFile, validateFile } from '#utils/util';
import { container } from '#root/Container';

export async function ListenerRegistry(cobalt: CobaltClient) {
	try {
		const files = sync('./dist/listeners/**/*.js');
		await Promise.all(files.map(async file => loadListener(file, cobalt)));
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

async function loadListener(file: string, cobalt: CobaltClient) {
	const listener = await resolveFile<Listener>(file);
	if (!listener) return;
	validateFile(file, listener);
	listener.cobalt = cobalt;
	container.listeners.set(listener.name, listener);
	cobalt[listener.once ? 'once' : 'on'](listener.name, (...args: unknown[]) => listener.run(...args));
	logger.info({ listener: { name: listener.name } }, `Registering listener: ${listener.name}`);
}
