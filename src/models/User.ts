import { Document, model, Schema } from 'mongoose';

export interface UserData {
	_id: string;
	guilds: string[];
	job: string | null;
	wallet: number;
	bank: number;
	bankSpace: number;
	netWorth: number;
	bounty: number;
	daily: number;
	weekly: number;
	inventory: object;
	activeItems: string[];
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
	daily: { type: Date, default: null },
	weekly: { type: Date, default: null },
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
