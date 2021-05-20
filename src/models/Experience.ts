import { Document, model, Schema } from "mongoose";

export interface ExperienceData {
    _id: string;
    username: string;
    guilds: string[];
    xp: number;
    lvl: number;
    totalXp: number;
};

export type IExperience = Document & ExperienceData;

const experienceSchema = new Schema<IExperience>({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    guilds: { type: Array, default: [] },
    xp: { type: Number, default: 0 },
    lvl: { type: Number, default: 0 },
    totalXp: { type: Number, default: 0 }
});

export default model("Experience", experienceSchema);