import { Document, model, Schema } from "mongoose";

export interface UserData {
    _id: string;
    roles: string[];
    daily: number;
    weekly: number;
    totalCommandsUsed: number;
};

export type IUser = Document & UserData;

const userSchema = new Schema<IUser>({
    _id: { type: String, required: true },
    roles: { type: Array, default: [] },
    daily: { type: Date, default: null },
    weekly: { type: Date, default: null },
    totalCommandsUsed: { type: Number, default: 0 }
});

export default model("User", userSchema);