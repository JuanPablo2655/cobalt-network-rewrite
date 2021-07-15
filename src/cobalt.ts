import { CobaltClient } from './struct/cobaltClient';
import './utils/mongo';
const cobalt: CobaltClient = new CobaltClient();

if (cobalt.devMode) {
	cobalt.on('debug', console.log).on('warn', console.log);
}

process.on('SIGTERM', async () => {
	console.info('SIGTERM signal received (kill).');
	await cobalt.close();
});

process.on('SIGINT', async () => {
	console.info('SIGINT signal received (terminal).');
	await cobalt.close();
});

// async () => {
// 	// can't wait until top-level await is a thing
// 	await cobalt.start();
// };
cobalt.start();
