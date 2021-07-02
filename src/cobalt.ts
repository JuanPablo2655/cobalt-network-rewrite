import { CobaltClient } from './struct/cobaltClient';
import './utils/mongo';
const cobalt: CobaltClient = new CobaltClient();

if (cobalt.devMode) {
	cobalt.on('debug', console.log).on('warn', console.log);
}

process.on('SIGTERM', () => {
	console.info('SIGTERM signal received (kill).');
	cobalt.close();
});

process.on('SIGINT', () => {
	console.info('SIGINT signal received (terminal).');
	cobalt.close();
});

cobalt.start();
