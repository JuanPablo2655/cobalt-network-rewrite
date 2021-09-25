import { Client, Collection, Intents, Snowflake } from 'discord.js';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { CommandRegistry, EventRegistry, InteractionRegistry } from './registries/export/RegistryIndex';
import { EventOptions } from '../typings/Options';
import Util from '../utils/Util';
import Database from '../utils/Database';
import Experience from '../utils/Experience';
import Economy from '../utils/Economy';
import Metrics from '../utils/Metrics';
import { GenericCommandOptions, InteractionCommandOptions } from '../typings/CommandOptions';
dotenv.config();

export class CobaltClient extends Client {
	public commands = new Collection<string, GenericCommandOptions>();
	public cooldowns = new Collection<string, Collection<string, number>>();
	public events = new Collection<string, EventOptions>();
	public interactions = new Collection<string, InteractionCommandOptions>();
	public voiceTime = new Map<Snowflake, number>();
	public devMode: boolean;
	public testEvents: boolean;
	public disableXp: boolean;
	public db: Database;
	public exp: Experience;
	public econ: Economy;
	public redis: Redis.Redis;
	public metrics: Metrics;

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				Intents.FLAGS.GUILD_INTEGRATIONS,
				Intents.FLAGS.GUILD_WEBHOOKS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			],
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
			allowedMentions: { repliedUser: false },
		});

		this.redis = new Redis(process.env.REDIS || '6379');
		this.devMode = process.env.DEVMODE === 'true' ? true : false;
		this.testEvents = process.env.TESTEVENTS === 'true' ? true : false;
		this.disableXp = process.env.DISABLEXP === 'true' ? true : false;
		this.voiceTime = new Map();
		this.db = new Database(this, process.env.MONGOURL || 'mongodb://localhost:27017/cobalt');
		this.exp = new Experience(this);
		this.econ = new Economy(this);
		this.metrics = new Metrics(this);
	}

	public start() {
		CommandRegistry(this);
		EventRegistry(this);
		InteractionRegistry(this);
		super.login(process.env.TOKEN);
		this.metrics.start();
	}

	public async close() {
		await this.redis.flushall();
		this.metrics.server.close();
		this.db.mongoose.close(false, () => {
			console.log('[Mongoose]\tMongoose connection successfully closed');
		});
		this.destroy();
	}
}
