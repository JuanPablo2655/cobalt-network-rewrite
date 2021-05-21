import { Document, model, Schema } from "mongoose";

export interface BotData {
    _id: string;
    directors: string[],
    totalCommandsUsed: number
};

export type IBot = Document & BotData;

const botSchema = new Schema<IBot>({
    _id: { type: String, required: true },
    directors: { type: Array, default: [] },
    totalCommandsUsed: { type: Number, default: 0 }
});

export default model("Bot", botSchema);