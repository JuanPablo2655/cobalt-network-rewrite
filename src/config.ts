import { URL } from 'node:url';
import { type BooleanString, envParseString, setup, envParseBoolean } from '@skyra/env-utilities';
import { type ClientOptions, GatewayIntentBits, Options, Partials } from 'discord.js';

setup(new URL('.env', import.meta.url));

export const OWNERS = ['288703114473635841', '232670598872956929'];

export function praseConfig() {
	return {
		token: envParseString('TOKEN'),
		prefix: envParseString('PREFIX', 'cn!'),
		redis: envParseString('REDIS', 'redis://localhost:6379'),
		testListeners: envParseBoolean('TEST_LISTENERS', false),
		disableXp: envParseBoolean('DISABLE_XP', false),
	};
}

export function parseClient() {
	return {
		id: envParseString('CLIENT_ID'),
		secret: envParseString('CLIENT_SECRET'),
	};
}

export function parseWebhooks() {
	return {
		shard: envParseString('SHARD_URL'),
		guild: envParseString('GUILD_URL'),
	};
}

export function parseElastic() {
	return {
		index: envParseString('ELASTIC_INDEX', 'index'),
		url: envParseString('ELASTIC_URL', 'http://localhost:9200'),
		username: envParseString('ELASTIC_USERNAME'),
		password: envParseString('ELASTIC_PASSWORD'),
		loggerName: envParseString('LOGGER_NAME', 'Cobaltia'),
	};
}

export const CLIENT_OPTIONS: ClientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
	allowedMentions: { repliedUser: false },
	makeCache: Options.cacheEverything(),
	sweepers: { ...Options.DefaultSweeperSettings },
};

declare module '@skyra/env-utilities' {
	interface Env {
		CLIENT_ID?: string;
		CLIENT_SECRET?: string;
		TOKEN?: string;
		PREFIX?: string;
		REDIS?: string;
		TEST_LISTENERS?: BooleanString;
		DISABLE_XP?: BooleanString;
		SHARD_URL?: string;
		GUILD_URL?: string;
		ELASTIC_INDEX?: string;
		ELASTIC_URL?: string;
		ELASTIC_USERNAME?: string;
		ELASTIC_PASSWORD?: string;
		LOGGER_NAME?: string;
	}
}
