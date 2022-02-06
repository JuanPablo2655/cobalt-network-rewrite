import { CobaltClient } from '#lib/cobaltClient';
import { logger } from '#lib/structures';

const cobalt: CobaltClient = new CobaltClient();

async function main() {
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
	} catch (err) {
		await cobalt.destory();
		process.exit(1);
	}
}

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received (kill).');
	await cobalt.destory();
	process.exit(1);
});

process.on('SIGINT', async () => {
	logger.info('SIGINT signal received (terminal).');
	await cobalt.destory();
	process.exit(0);
});

process.on('unhandledRejection', err => {
	const error = err as Error;
	logger.error(error, error.message);
});

main().catch(error => logger.error(error));
