import { Document, model, Schema } from "mongoose";

export interface EconomyData {
    _id: string;
    username: string;
    guilds: string[];
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
    username: { type: String, default: null },
    guilds: { type: Array, default: [] },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    bankSpace: { type: Number, default: 0 },
    netWorth: { type: Number, default: 0 },
    bounty: { type: Number, default: 0 },
    items: { type: Array, default: [] }
});

export default model("Economy", economySchema);