import { Snowflake } from 'discord.js';
import { Document, model, Schema } from 'mongoose';
import { ClassOptions } from '../../data/classes';
import { RaceOptions } from '../../data/races';

export interface CompanionData {
	_id: Snowflake;
	name?: string | null;
	race?: RaceOptions | null;
	gender?: string | null;
	class?: ClassOptions | null;
	level: number;
	xp: number;
	health: number;
	magicka: number;
}

export type ICompanion = Document & CompanionData;

const companionSchema = new Schema<ICompanion>({
	_id: { type: String, required: true },
	name: { type: String, default: null },
	race: { type: String, default: null },
	gender: { type: String, default: null },
	class: { type: String, default: null },
	level: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
});

export default model('Companion', companionSchema);