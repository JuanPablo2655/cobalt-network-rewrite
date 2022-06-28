import { Snowflake } from 'discord.js';
import mongoose, { Document } from 'mongoose';

export interface GuildData {
	/**
	 * Guild Id
	 */
	_id: Snowflake;

	/**
	 * Guild prefix
	 */
	prefix: string;

	/**
	 * If the bot is verified or not
	 */
	verified: boolean;

	/**
	 * Words blacklisted from the guild
	 */
	blacklistedWords?: string[] | null;

	/**
	 * Commands disabled from the guild
	 */
	disabledCommands?: string[] | null;

	/**
	 * Categories disabled from the guild
	 */
	disabledCategories?: string[] | undefined | null;

	/**
	 * The mute role Id
	 */
	mutedRoleId?: string | null;

	/**
	 * The {@link LevelMessage} options
	 */
	levelMessage?: LevelMessage | null;

	/**
	 * The {@link WelcomeMessage} options
	 */
	welcomeMessage?: WelcomeMessage | null;

	/**
	 * The {@link LeaveMessage} options
	 */
	leaveMessage?: LeaveMessage | null;

	/**
	 * The {@link BanMessage} options
	 */
	banMessage?: BanMessage | null;

	/**
	 * The {@link LogChannel} options
	 */
	logChannel?: LogChannel | null;
}

export interface LevelMessage {
	/**
	 * The level up message
	 */
	message: string;

	/**
	 * Whether if the level up message is sent or not
	 */
	enabled: boolean;
}

export interface WelcomeMessage {
	/**
	 * The welcome message
	 */
	message: string | null;

	/**
	 * The channel Id
	 */
	channelId: Snowflake | null;

	/**
	 * Whether if the welcome message is sent or not
	 */
	enabled: boolean;
}

export interface LeaveMessage {
	/**
	 * The leave message
	 */
	message: string | null;

	/**
	 * The channel Id
	 */
	channelId: Snowflake | null;

	/**
	 * Whether if the leave message is sent or not
	 */
	enabled: boolean;
}

export interface BanMessage {
	/**
	 * The ban message
	 */
	message: string;

	/**
	 * Whether if the ban message is sent or not
	 */
	enabled: boolean;
}

export interface LogChannel {
	/**
	 * The channel Id
	 */
	channelId: Snowflake | null;

	/**
	 * Whether if the bot logs or not
	 */
	enabled: boolean;

	/**
	 * Events that are ignored
	 */
	disabledEvents: string[] | null;
}

export type IGuild = Document & GuildData;

const guildSchema = new mongoose.Schema<IGuild>({
	_id: { type: String, required: true },
	prefix: { type: String, default: 'cn!' },
	verified: { type: Boolean, default: false },
	blacklistedWords: { type: Array, default: [] },
	disabledCommands: { type: Array, default: [] },
	disabledCategories: { type: Array, default: [] },
	mutedRoleId: { type: String, default: null },
	levelMessage: {
		type: Object,
		default: { message: 'Congratulations {user.tag} you are now level {newLevel}!', enabled: true },
	},
	welcomeMessage: {
		type: Object,
		default: { message: 'Welcome, {user.tag} to {guild.name}!', channelId: null, enabled: true },
	},
	leaveMessage: {
		type: Object,
		default: { message: 'Goodbye {user.username}.', channelId: null, enabled: true },
	},
	banMessage: {
		type: Object,
		default: { message: '{user.username} got banned from the server!', enabled: true },
	},
	logChannel: {
		type: Object,
		default: { channelId: null, enabled: true, disabledEvents: [] },
	},
});

export default mongoose.model('Guild', guildSchema);
