import { CobaltClient } from '#lib/cobaltClient';
import { logger } from '#lib/structures';
const cobalt: CobaltClient = new CobaltClient();

if (cobalt.devMode) {
	cobalt
		.on('debug', stream => {
			logger.debug(stream);
		})
		.on('warn', stream => {
			logger.warn(stream);
		});
}

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received (kill).');
	await cobalt.close();
	process.exit(1);
});

process.on('SIGINT', async () => {
	logger.info('SIGINT signal received (terminal).');
	await cobalt.close();
	process.exit(0);
});

process.on('unhandledRejection', err => {
	const error = err as Error;
	logger.error(error, error.message);
});

cobalt.start();
