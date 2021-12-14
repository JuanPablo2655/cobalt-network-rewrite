import { Default } from '#lib/typings';
import { Snowflake } from 'discord.js';
import { Document, model, Schema } from 'mongoose';

export interface UserData {
	_id: Snowflake;
	guilds?: string[] | null;
	job?: string | null;
	socialCredit: number;
	wallet: number;
	bank: number;
	bankSpace: number;
	netWorth: number;
	bounty: number;
	daily?: number | null;
	weekly?: number | null;
	monthly?: number | null;
	repTime?: number | null;
	vcHours?: number[] | null;
	inventory: object;
	activeItems?: string[] | null;
	xp: number;
	lvl: number;
	rep: number;
	totalXp: number;
	lost: number;
	won: number;
	deaths: number;
	totalCommandsUsed: number;
}

export type IUser = Document & UserData;

const userSchema = new Schema<IUser>({
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

export default model('User', userSchema);
