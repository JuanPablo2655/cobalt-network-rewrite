import { Client, Collection, Snowflake } from 'discord.js';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { CommandRegistry, EventRegistry, InteractionRegistry, logger } from './structures';
import { EventOptions } from './typings/Options';
import Database from './utils/Database';
import Experience from './utils/Experience';
import Economy from './utils/Economy';
import Metrics from './utils/Metrics';
import { GenericCommandOptions, InteractionCommandOptions } from './typings/CommandOptions';
import { CLIENT_OPTIONS } from '#root/config';
dotenv.config();

export class CobaltClient extends Client {
	public dev = process.env.NODE_ENV !== 'production';
	public commands = new Collection<string, GenericCommandOptions>();
	public cooldowns = new Collection<string, Collection<string, number>>();
	public events = new Collection<string, EventOptions>();
	public interactions = new Collection<string, InteractionCommandOptions>();
	public voiceTime = new Map<Snowflake, number>();
	public testEvents = process.env.TESTEVENTS === 'true';
	public disableXp = process.env.DISABLEXP === 'true';
	public db = new Database(this, process.env.MONGOURL || 'mongodb://localhost:27017/cobalt');
	public exp = new Experience(this);
	public econ = new Economy(this);
	public redis = new Redis(process.env.REDIS ?? '6379');
	public metrics = new Metrics(this);

	constructor() {
		super(CLIENT_OPTIONS);
	}

	public async login(token?: string) {
		CommandRegistry(this);
		EventRegistry(this);
		InteractionRegistry(this);
		const loginRespopnse = await super.login(token);
		this.metrics.start();
		return loginRespopnse;
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
