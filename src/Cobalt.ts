import process from 'node:process';
import { CobaltClient } from '#lib/CobaltClient';
import { logger } from '#lib/structures';

const cobalt: CobaltClient = new CobaltClient();

try {
	if (cobalt.dev) {
		cobalt
			.on('debug', stream => {
				logger.debug(stream);
			})
			.on('warn', stream => {
				logger.warn(stream);
			});
	}

	await cobalt.login();
} catch (error) {
	const err = error as Error;
	logger.error(err);
	cobalt.destroy();
	process.exit(1);
}
