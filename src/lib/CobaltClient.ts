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
	public commands = new Collection<string, GenericCommandOptions>();
	public cooldowns = new Collection<string, Collection<string, number>>();
	public events = new Collection<string, ListenerOptions>();
	public interactions = new Collection<string, InteractionCommandOptions>();
	public voiceTime = new Map<Snowflake, number>();
	public testListeners = config.testListeners;
	public disableXp = config.disableXp;
	public db = new Database(this, config.mongoURL);
	public exp = new Experience(this);
	public econ = new Economy(this);
	public redis = new Redis(config.redis);
	public metrics = new Metrics(this);

	constructor() {
		super(CLIENT_OPTIONS);
		this.on('raw', packet => this.metrics.eventInc(packet.t));
	}

	public async login(token = config.token) {
		await Promise.all([CommandRegistry(this), ListenerRegistry(this), InteractionRegistry(this)]);
		const loginResponse = await super.login(token);
		this.metrics.start();
		return loginResponse;
	}

	public async destory() {
		await this.redis.flushall();
		this.metrics.server.close();
		this.db.mongoose.close(false, () => {
			logger.info('Mongoose connection successfully closed');
		});
		return super.destroy();
	}
}
