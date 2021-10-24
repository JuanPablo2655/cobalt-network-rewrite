import { CobaltClient } from './structures/cobaltClient';
const cobalt: CobaltClient = new CobaltClient();

if (cobalt.devMode) {
	cobalt.on('debug', console.log).on('warn', console.log);
}

process.on('SIGTERM', async () => {
	console.info('SIGTERM signal received (kill).');
	await cobalt.close();
	process.exit(1);
});

process.on('SIGINT', async () => {
	console.info('SIGINT signal received (terminal).');
	await cobalt.close();
	process.exit(0);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

cobalt.start();
