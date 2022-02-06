import { Default } from '#lib/typings';
import { Snowflake } from 'discord.js';
import { Document, model, Schema } from 'mongoose';

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
	 * Totoal commands executed by the users
	 */
	totalCommandsUsed: number;
}

export type IBot = Document & BotData;

const botSchema = new Schema<IBot>({
	_id: { type: String, required: true },
	directors: { type: Array, default: [] },
	tax: { type: Number, default: Default.Tax },
	bank: { type: Number, default: 0 },
	totalCommandsUsed: { type: Number, default: 0 },
});

export default model('Bot', botSchema);
