import process from 'node:process';
import { Client, Snowflake } from 'discord.js';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { CommandRegistry, ListenerRegistry, InteractionRegistry } from '#lib/structures';
import Metrics from './utils/Metrics.js';
import { CLIENT_OPTIONS, config } from '#root/config';
import { PrismaClient } from '@prisma/client';
import { container } from '../Container.js';
dotenv.config();

export class CobaltClient extends Client {
	public dev = process.env.NODE_ENV !== 'production';
	public testListeners = config.testListeners;
	public disableXp = config.disableXp;

	constructor() {
		super(CLIENT_OPTIONS);
		container.messageCooldowns = new Set();
		container.redis = new Redis(config.redis);
		container.metrics = new Metrics(this);
		container.db = new PrismaClient();
		container.cobalt = this;
		this.on('raw', packet => container.metrics.eventInc(packet.t));
	}

	public override async login(token = config.token) {
		await Promise.all([CommandRegistry(this), ListenerRegistry(this), InteractionRegistry(this)]);
		const loginResponse = await super.login(token);
		container.metrics.start();
		return loginResponse;
	}

	public override async destroy() {
		await container.redis.flushall();
		await container.db.$disconnect();
		container.metrics.server.close();
		return super.destroy();
	}
}

declare module '../Container.js' {
	interface Container {
		redis: Redis;
		metrics: Metrics;
		db: PrismaClient;
		cobalt: CobaltClient;
		messageCooldowns: Set<Snowflake>;
	}
}
