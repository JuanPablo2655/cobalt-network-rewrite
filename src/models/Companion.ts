import { Document, model, Schema } from "mongoose";

export interface CompanionData {
    _id: string;
    name: string;
    race: string;
    gender: string;
    class: string;
    level: number;
    xp: number;
}

export type ICompanion = Document & CompanionData;

const companionSchema = new Schema<ICompanion>({
    _id: { type: String, required: true },
    name: { type: String, default: null },
    race: { type: String, default: null },
    gender: { type: String, default: null },
    class: { type: String, default: null },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 }
});

export default model("Companion", companionSchema);