import { Snowflake } from 'discord.js';
import { Document, model, ObjectId, Schema } from 'mongoose';

export interface MemberData {
	_id: ObjectId;
	memberId: Snowflake;
	guildId: Snowflake;
	roles: Snowflake[];
	vcHours: number;
	mutes: string[];
	warns: string[];
}

export type IMember = Document & MemberData;

const memberSchema = new Schema<IMember>({
	memberId: { type: String, required: true },
	guildId: { type: String, required: true },
	vcHours: { type: Number, default: 0 },
	roles: { type: Array, default: [] },
	mutes: { type: Array, default: [] },
	warns: { type: Array, default: [] },
});

export default model('Member', memberSchema);
