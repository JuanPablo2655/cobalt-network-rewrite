import process from 'node:process';
import { type ClientOptions, Intents, Options } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
	/** Client information */
	client: {
		/** Bot client Id found in Discord Devlopment Portal */
		id: process.env.CLIENT_ID,
		/** Bot client secret found in Discord Devlopment Portal */
		secret: process.env.CLIENT_SECRET,
	},
	/** Bot token */
	token: process.env.TOKEN,
	/** Owners ids  */
	owners: process.env.OWNERS?.split(',') ?? ['288703114473635841'],
	/** Default message command prefix */
	prefix: process.env.PREFIX ?? 'cn!',
	/** MongoDB URI */
	mongoURL: process.env.MONGOURL ?? 'mongodb://localhost:27017/cobalt',
	/** Redis URI */
	redis: process.env.REDIS ?? 'redis://localhost:6379',
	/** Either test listeners or not */
	testListeners: process.env.TESTLISTENERS === 'true' ?? false,
	/** Disable XP in devlopment */
	disableXp: process.env.DISABLEXP === 'true' ?? false,
	/** Webhook URLs */
	webhooks: {
		/** Shard webhook URL */
		shard: process.env.SHARDURL,
		/** Guild join/leave webhook URL */
		guild: process.env.GUILDURL,
	},
	/** Elastic information */
	elastic: {
		/** Elastic index id */
		index: process.env.ELASTIC_INDEX ?? 'index',
		/** Elastic URL */
		url: process.env.ELASTIC_URL ?? 'http://localhost:9200',
		/** Elastic login username */
		username: process.env.ELASTIC_USERNAME,
		/** Elastic login password */
		password: process.env.ELASTIC_PASSWORD,
		/** Elastic logger name */
		loggerName: process.env.LOGGER_NAME,
	},
};

export const CLIENT_OPTIONS: ClientOptions = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
	allowedMentions: { repliedUser: false },
	makeCache: Options.cacheEverything(),
	sweepers: { ...Options.defaultSweeperSettings },
};
