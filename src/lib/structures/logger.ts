import pino from 'pino';
// @ts-expect-error
import pinoElastic from 'pino-elasticsearch';
import ecsFormat from '@elastic/ecs-pino-format';
import pinoMultistream from 'pino-multi-stream';

import * as dotenv from 'dotenv';
dotenv.config();

const streamToElastic = pinoElastic({
	index: process.env.ELASTIC_INDEX ?? 'index',
	consistency: 'one',
	node: process.env.ELASTIC_URL ?? 'http://localhost:9200',
	auth: {
		username: process.env.ELASTIC_USERNAME,
		password: process.env.ELASTIC_PASSWORD,
	},
	'es-version': 7,
});

export const logger = pino(
	{ level: 'trace', ...ecsFormat(), name: process.env.LOGGER_NAME ?? 'log' },
	pinoMultistream.multistream([{ stream: process.stdout }, { stream: streamToElastic }]),
);
