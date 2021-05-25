import { Document, model, ObjectId, Schema } from "mongoose";

export interface UserData {
    _id: ObjectId;
    userId: string;
    guildId: string;
    roles: string[];
    daily: number;
    weekly: number;
    totalCommandsUsed: number;
};

export type IUser = Document & UserData;

const userSchema = new Schema<IUser>({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    roles: { type: Array, default: [] },
    daily: { type: Date, default: null },
    weekly: { type: Date, default: null },
    totalCommandsUsed: { type: Number, default: 0 }
});

export default model("User", userSchema);