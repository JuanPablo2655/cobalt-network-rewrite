import { URL } from 'node:url';
import { type BooleanString, envParseString, setup, envParseBoolean } from '@skyra/env-utilities';
import { type ClientOptions, GatewayIntentBits, Options, Partials } from 'discord.js';

setup(new URL('.env', import.meta.url));

export const OWNERS = ['288703114473635841', '232670598872956929'];

export const config = {
	/**
	 * Client information
	 */
	client: {
		/**
		 * Bot client Id found in Discord Development Portal
		 */
		id: envParseString('CLIENT_ID'),
		/**
		 * Bot client secret found in Discord Development Portal
		 */
		secret: envParseString('CLIENT_SECRET'),
	},
	/**
	 * Bot token
	 */
	token: envParseString('TOKEN'),
	/**
	 * Default message command prefix
	 */
	prefix: envParseString('PREFIX', 'cn!'),
	/**
	 * Redis URI
	 */
	redis: envParseString('REDIS', 'redis://localhost:6379'),
	/**
	 * Either test listeners or not
	 */
	testListeners: envParseBoolean('TEST_LISTENERS', false),
	/**
	 * Disable XP in development
	 */
	disableXp: envParseBoolean('DISABLE_XP', false),
	/**
	 * Webhook URLs
	 */
	webhooks: {
		/**
		 * Shard webhook URL
		 */
		shard: envParseString('SHARD_URL'),
		/**
		 * Guild join/leave webhook URL
		 */
		guild: envParseString('GUILD_URL'),
	},
	/**
	 * Elastic information
	 */
	elastic: {
		/**
		 * Elastic index id
		 */
		index: envParseString('ELASTIC_INDEX', 'index'),
		/**
		 * Elastic URL
		 */
		url: envParseString('ELASTIC_URL', 'http://localhost:9200'),
		/**
		 * Elastic login username
		 */
		username: envParseString('ELASTIC_USERNAME'),
		/**
		 * Elastic login password
		 */
		password: envParseString('ELASTIC_PASSWORD'),
		/**
		 * Elastic logger name
		 */
		loggerName: envParseString('LOGGER_NAME', 'Cobaltia'),
	},
};

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
