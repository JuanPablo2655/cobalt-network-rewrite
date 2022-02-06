import { type ClientOptions, Intents, Options } from 'discord.js';

export const config = {
	token: process.env.TOKEN,
	owners: process.env.OWNERS?.split(',') ?? ['288703114473635841'],
	prefix: process.env.PREFIX ?? 'cn!',
	mongoURL: process.env.MONGOURL,
	redis: process.env.REDIS,
	devMode: process.env.DEVMODE,
	testEvents: process.env.TESTEVENTS,
	disableXp: process.env.DISABLEXP,
	port: process.env.PORT,
	webhooks: {
		shard: process.env.SHARDURL,
		guild: process.env.GUILDURL,
	},
	elastic: {
		index: process.env.ELASTIC_INDEX,
		url: process.env.ELASTIC_URL,
		username: process.env.ELASTIC_USERNAME,
		password: process.env.ELASTIC_PASSWORD,
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
