import process from 'node:process';
import ecsFormat from '@elastic/ecs-pino-format';
import pino, { type Logger, multistream } from 'pino';
// @ts-expect-error: no type definitions
import pinoElastic from 'pino-elasticsearch';
import { parseElastic } from '#root/config';

// eslint-disable-next-line import/no-mutable-exports
let logger: Logger;

if (process.env.NODE_ENV === 'production') {
	const elastic = parseElastic();
	const streamToElastic = pinoElastic({
		index: elastic.index,
		consistency: 'one',
		node: elastic.url,
		auth: {
			username: elastic.username,
			password: elastic.password,
		},
		'es-version': 7,
	});
	logger = pino(
		{ ...ecsFormat(), name: elastic.loggerName },
		multistream([{ stream: process.stdout }, { stream: streamToElastic }]),
	);
} else {
	logger = pino({ level: 'trace' });
}

export { logger };
