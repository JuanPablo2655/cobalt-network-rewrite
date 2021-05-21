import { Document, model, Schema } from "mongoose";

export interface GuildData {
    _id: string;
    prefix: string;
    verified: boolean;
    blacklistedWords: string[];
    disabledCommands: string[];
    disabledCategories: string[];
    mutedRoleId: string;
    levelMessage: LevelMessage;
    welcomeMessage: WelcomeMessage;
    leaveMessage: LeaveMessage;
    banMessage: BanMessage;
    logChannel: LogChannel;
};

export interface LevelMessage {
    message: string;
    enabled: boolean;
};

export interface WelcomeMessage {
    message: string | null;
    enabled: boolean;
};

export interface LeaveMessage {
    message: string | null;
    enabled: boolean;
};

export interface BanMessage {
    message: string;
    enabled: boolean;
};

export interface LogChannel {
    channelId: string,
    enabled: boolean,
    disabledEvents: string[]
}

export type IGuild = Document & GuildData;

const guildSchema = new Schema<IGuild>({
    _id: { type: String, required: true },
    prefix: { type: String, default: "cn!" },
    verified: { type: Boolean, default: false },
    blacklistedWords: { type: Array, default: [] },
    disabledCommands: { type: Array, default: [] },
    disabledCategories: { type: Array, default: [] },
    mutedRoleId: { type: String, default: null },
    levelMessage: {
        type: Object,
        default: { message: "Congratulations {user.tag} you are now level {newLevel}!", enabled: true }
    },
    welcomeMessage: {
        type: Object,
        default: { message: "Welcome, {user.tag} to {guild.name}!", enabled: true }
    },
    leaveMessage: {
        type: Object,
        default: { message: "Goodbye {user.username}.", enabled: true }
    },
    banMessage: {
        type: Object,
        default: { message: "{user.username} got banned from the server!", enabled: true }
    },
    logChannel: {
        type: Object,
        default: { channelId: null, enabled: true, disabledEvents: [] }
    },
});

export default model("Guild", guildSchema);