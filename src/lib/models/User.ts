import { Default } from '#lib/typings';
import { Snowflake } from 'discord.js';
import mongoose, { Document } from 'mongoose';

export interface UserData {
	/**
	 * The user Id
	 */
	_id: Snowflake;

	/**
	 * The guilds the user is found in
	 */
	guilds?: string[] | null;

	/**
	 * The users job
	 */
	job?: string | null;

	/**
	 * The total social credit the user has
	 */
	socialCredit: number;

	/**
	 * The money the user has in their pockets
	 */
	wallet: number;

	/**
	 * The money the user has in their bank
	 */
	bank: number;

	/**
	 * How much space the user has in their bank account
	 */
	bankSpace: number;

	/**
	 * Total net worth
	 */
	netWorth: number;

	/**
	 * Bounty the user has
	 */
	bounty: number;

	/**
	 * Daily cooldown
	 */
	daily?: number | null;

	/**
	 * Weekly cooldown
	 */
	weekly?: number | null;

	/**
	 * Monthly cooldown
	 */
	monthly?: number | null;

	/**
	 * Reputation cooldown
	 */
	repTime?: number | null;

	/**
	 * A collection of time spent in vc in all guilds
	 */
	vcHours?: number[] | null;

	/**
	 * Items in the users inventory
	 */
	inventory: object;

	/**
	 * Active items
	 */
	activeItems?: string[] | null;

	/**
	 * XP the user currently has
	 */
	xp: number;

	/**
	 * The amount of levels the user has
	 */
	lvl: number;

	/**
	 * How much reputation the user has
	 */
	rep: number;

	/**
	 * Total XP gained
	 */
	totalXp: number;

	/**
	 * Games lost
	 */
	lost: number;

	/**
	 * Games won
	 */
	won: number;

	/**
	 * Total amount of times the user has died
	 */
	deaths: number;

	/**
	 * Total of commands the user has ran
	 */
	totalCommandsUsed: number;
}

export type IUser = Document & UserData;

const userSchema = new mongoose.Schema<IUser>({
	_id: { type: String, required: true },
	guilds: { type: Array, default: [] },
	job: { type: String, default: null },
	socialCredit: { type: Number, default: Default.SocialCredit },
	wallet: { type: Number, default: Default.Wallet },
	bank: { type: Number, default: Default.Bank },
	bankSpace: { type: Number, default: Default.BankSpace },
	netWorth: { type: Number, default: Default.Default },
	bounty: { type: Number, default: Default.Default },
	daily: { type: Number, default: null },
	weekly: { type: Number, default: null },
	monthly: { type: Number, default: null },
	vcHours: { type: [Number], default: null },
	repTime: { type: Number, default: null },
	inventory: { type: Object, default: {} },
	activeItems: { type: Array, default: [] },
	xp: { type: Number, default: Default.Xp },
	lvl: { type: Number, default: Default.Level },
	rep: { type: Number, default: Default.Default },
	totalXp: { type: Number, default: Default.Default },
	lost: { type: Number, default: Default.Default },
	won: { type: Number, default: Default.Default },
	deaths: { type: Number, default: Default.Default },
	totalCommandsUsed: { type: Number, default: Default.Default },
});

export default mongoose.model('User', userSchema);
