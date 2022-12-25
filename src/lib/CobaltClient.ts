import process from 'node:process';
import { Client } from 'discord.js';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { CommandRegistry, ListenerRegistry, InteractionRegistry, logger } from '#lib/structures';
import Database from './utils/Database.js';
import Experience from './utils/Experience.js';
import Economy from './utils/Economy.js';
import Metrics from './utils/Metrics.js';
import { CLIENT_OPTIONS, config } from '#root/config';
import { PrismaClient } from '@prisma/client';
import { container } from '../Container.js';
dotenv.config();

export class CobaltClient extends Client {
	public dev = process.env.NODE_ENV !== 'production';
	public container = container;
	public testListeners = config.testListeners;
	public disableXp = config.disableXp;

	constructor() {
		super(CLIENT_OPTIONS);
		container.db = new Database(this, config.mongoURL);
		container.exp = new Experience(this);
		container.econ = new Economy(this);
		container.redis = new Redis(config.redis);
		container.metrics = new Metrics(this);
		container.prisma = new PrismaClient();
		this.on('raw', packet => this.container.metrics.eventInc(packet.t));
	}

	public async login(token = config.token) {
		await Promise.all([CommandRegistry(this), ListenerRegistry(this), InteractionRegistry(this)]);
		const loginResponse = await super.login(token);
		this.container.metrics.start();
		return loginResponse;
	}

	public async destroy() {
		await this.container.redis.flushall();
		this.container.metrics.server.close();
		this.container.db.mongoose.close(false, () => {
			logger.info('Mongoose connection successfully closed');
		});
		return super.destroy();
	}
}

declare module '../Container.js' {
	interface Container {
		db: Database;
		exp: Experience;
		econ: Economy;
		redis: Redis;
		metrics: Metrics;
		prisma: PrismaClient;
	}
}
