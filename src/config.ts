import process from 'node:process';
import { type ClientOptions, GatewayIntentBits, Options, Partials } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const OWNERS = process.env.OWNERS?.split(',') ?? ['288703114473635841'];

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
	/** Default message command prefix */
	prefix: process.env.PREFIX ?? 'cn!',
	/** MongoDB URI */
	mongoURL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/cobalt',
	/** Redis URI */
	redis: process.env.REDIS ?? 'redis://localhost:6379',
	/** Either test listeners or not */
	testListeners: process.env.TEST_LISTENERS === 'true' ?? false,
	/** Disable XP in devlopment */
	disableXp: process.env.DISABLE_XP === 'true' ?? false,
	/** Webhook URLs */
	webhooks: {
		/** Shard webhook URL */
		shard: process.env.SHARD_URL,
		/** Guild join/leave webhook URL */
		guild: process.env.GUILD_URL,
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
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
	allowedMentions: { repliedUser: false },
	makeCache: Options.cacheEverything(),
	sweepers: { ...Options.DefaultSweeperSettings },
};
