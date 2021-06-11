import { Document, model, Schema } from "mongoose";

export interface EconomyData {
    _id: string;
    guilds: string[];
    job: string;
    wallet: number;
    bank: number;
    bankSpace: number;
    netWorth: number;
    bounty: number;
    items: string[];
};

export type IEconomy = Document & EconomyData;

const economySchema = new Schema<IEconomy>({
    _id: { type: String, required: true },
    guilds: { type: Array, default: [] },
    job: { type: String, default: null },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    bankSpace: { type: Number, default: 0 },
    netWorth: { type: Number, default: 0 },
    bounty: { type: Number, default: 0 },
    items: { type: Array, default: [] }
});

export default model("Economy", economySchema);