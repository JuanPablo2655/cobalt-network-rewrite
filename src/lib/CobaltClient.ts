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
	public container = container;
	public testListeners = config.testListeners;
	public disableXp = config.disableXp;

	constructor() {
		super(CLIENT_OPTIONS);
		container.messageCooldowns = new Set();
		container.redis = new Redis(config.redis);
		container.metrics = new Metrics(this);
		container.prisma = new PrismaClient();
		container.cobalt = this;
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
		return super.destroy();
	}
}

declare module '../Container.js' {
	interface Container {
		redis: Redis;
		metrics: Metrics;
		prisma: PrismaClient;
		cobalt: CobaltClient;
		messageCooldowns: Set<Snowflake>;
	}
}
