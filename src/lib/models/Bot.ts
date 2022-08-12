import { Default } from '#lib/typings';
import { Snowflake } from 'discord.js';
import mongoose, { Document } from 'mongoose';

export interface BotData {
	/**
	 * Bot userId
	 */
	_id: Snowflake;

	/**
	 * The userId's of the directors
	 */
	directors?: Snowflake[] | null;

	/**
	 * Global tax rate
	 */
	tax: number;

	/**
	 * Where all the tax money is collected
	 */
	bank: number;

	/**
	 * Total commands executed by the users
	 */
	totalCommandsUsed: number;
}

export type IBot = Document & BotData;

const botSchema = new mongoose.Schema<IBot>({
	_id: { type: String, required: true },
	directors: { type: Array, default: [] },
	tax: { type: Number, default: Default.Tax },
	bank: { type: Number, default: 0 },
	totalCommandsUsed: { type: Number, default: 0 },
});

export default mongoose.model('Bot', botSchema);
