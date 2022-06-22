import process from 'node:process';
import { Client, Collection, Snowflake } from 'discord.js';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { CommandRegistry, ListenerRegistry, InteractionRegistry, logger } from './structures';
import { ListenerOptions } from './typings/Options';
import Database from './utils/Database';
import Experience from './utils/Experience';
import Economy from './utils/Economy';
import Metrics from './utils/Metrics';
import { GenericCommandOptions, InteractionCommandOptions } from './typings/CommandOptions';
import { CLIENT_OPTIONS, config } from '#root/config';
dotenv.config();

export class CobaltClient extends Client {
	public dev = process.env.NODE_ENV !== 'production';
	public container = {
		commands: new Collection<string, GenericCommandOptions>(),
		cooldowns: new Collection<string, Collection<string, number>>(),
		listeners: new Collection<string, ListenerOptions>(),
		interactions: new Collection<string, InteractionCommandOptions>(),
		voiceTime: new Map<Snowflake, number>(),
		db: new Database(this, config.mongoURL),
		exp: new Experience(this),
		econ: new Economy(this),
		redis: new Redis(config.redis),
		metrics: new Metrics(this),
	};
	public testListeners = config.testListeners;
	public disableXp = config.disableXp;

	constructor() {
		super(CLIENT_OPTIONS);
		this.on('raw', packet => this.container.metrics.eventInc(packet.t));
	}

	public async login(token = config.token) {
		await Promise.all([CommandRegistry(this), ListenerRegistry(this), InteractionRegistry(this)]);
		const loginResponse = await super.login(token);
		this.container.metrics.start();
		return loginResponse;
	}

	public async destory() {
		await this.container.redis.flushall();
		this.container.metrics.server.close();
		this.container.db.mongoose.close(false, () => {
			logger.info('Mongoose connection successfully closed');
		});
		return super.destroy();
	}
}
