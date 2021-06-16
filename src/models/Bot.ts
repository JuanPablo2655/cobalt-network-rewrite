import { Document, model, Schema } from 'mongoose';

export interface BotData {
	_id: string;
	directors: string[];
	tax: number;
	bank: number;
	totalCommandsUsed: number;
}

export type IBot = Document & BotData;

const botSchema = new Schema<IBot>({
	_id: { type: String, required: true },
	directors: { type: Array, default: [] },
	tax: { type: Number, default: 0 },
	bank: { type: Number, default: 0 },
	totalCommandsUsed: { type: Number, default: 0 },
});

export default model('Bot', botSchema);
