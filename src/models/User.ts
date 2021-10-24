import { Snowflake } from 'discord.js';
import { Document, model, Schema } from 'mongoose';

export interface UserData {
	_id: Snowflake;
	guilds?: string[] | null;
	job?: string | null;
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
	wallet: { type: Number, default: 0 },
	bank: { type: Number, default: 0 },
	bankSpace: { type: Number, default: 1000 },
	netWorth: { type: Number, default: 0 },
	bounty: { type: Number, default: 0 },
	daily: { type: Number, default: null },
	weekly: { type: Number, default: null },
	monthly: { type: Number, default: null },
	vcHours: { type: [Number], default: null },
	repTime: { type: Number, default: null },
	inventory: { type: Object, default: {} },
	activeItems: { type: Array, default: [] },
	xp: { type: Number, default: 0 },
	lvl: { type: Number, default: 0 },
	rep: { type: Number, default: 0 },
	totalXp: { type: Number, default: 0 },
	lost: { type: Number, default: 0 },
	won: { type: Number, default: 0 },
	deaths: { type: Number, default: 0 },
	totalCommandsUsed: { type: Number, default: 0 },
});

export default model('User', userSchema);
