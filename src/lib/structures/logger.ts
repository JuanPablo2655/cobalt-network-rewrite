import process from 'node:process';
import pino, { Logger, multistream } from 'pino';
// @ts-expect-error: no type definitions
import pinoElastic from 'pino-elasticsearch';
import ecsFormat from '@elastic/ecs-pino-format';
import { config } from '#root/config';

let logger: Logger;
if (process.env.NODE_ENV !== 'production') {
	logger = pino({ level: 'trace' });
} else {
	const streamToElastic = pinoElastic({
		index: config.elastic.index,
		consistency: 'one',
		node: config.elastic.url ?? 'http://localhost:9200',
		auth: {
			username: config.elastic.username,
			password: config.elastic.password,
		},
		'es-version': 7,
	});
	logger = pino(
		{ ...ecsFormat(), name: config.elastic.loggerName },
		multistream([{ stream: process.stdout }, { stream: streamToElastic }]),
	);
}

export { logger };
