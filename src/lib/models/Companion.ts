import { Default } from '#lib/typings';
import { Snowflake } from 'discord.js';
import { Document, model, Schema } from 'mongoose';
import { ClassOptions } from '../data/classes';
import { RaceOptions } from '../data/races';

export interface CompanionData {
	/**
	 * Owner's userId
	 */
	_id: Snowflake;

	/**
	 * Name the companion has
	 */
	name?: string | null;

	/**
	 * The companion's race
	 */
	race?: RaceOptions | null;

	/**
	 * The companion's gender
	 */
	gender?: string | null;

	/**
	 * The companion's class
	 */
	class?: ClassOptions | null;

	/**
	 * The level the companion has
	 */
	level: number;

	/**
	 * The amount of XP the companion has
	 */
	xp: number;

	/**
	 * The amount of health the companion has
	 */
	health: number;

	/**
	 * The amount of magicka the companion has
	 */
	magicka: number;
}

export type ICompanion = Document & CompanionData;

const companionSchema = new Schema<ICompanion>({
	_id: { type: String, required: true },
	name: { type: String, default: null },
	race: { type: String, default: null },
	gender: { type: String, default: null },
	class: { type: String, default: null },
	level: { type: Number, default: Default.Level },
	xp: { type: Number, default: Default.Xp },
});

export default model('Companion', companionSchema);
