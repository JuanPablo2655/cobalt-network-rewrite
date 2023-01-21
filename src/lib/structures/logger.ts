import process from 'node:process';
import ecsFormat from '@elastic/ecs-pino-format';
import pino, { type Logger, multistream } from 'pino';
// @ts-expect-error: no type definitions
import pinoElastic from 'pino-elasticsearch';
import { config } from '#root/config';

// eslint-disable-next-line import/no-mutable-exports
let logger: Logger;

if (process.env.NODE_ENV === 'production') {
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
		{ ...ecsFormat(), name: config.elastic.loggerName ?? 'Cobaltia' },
		multistream([{ stream: process.stdout }, { stream: streamToElastic }]),
	);
} else {
	logger = pino({ level: 'trace' });
}

export { logger };
