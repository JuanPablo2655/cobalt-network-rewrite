import { Message, PermissionString } from "discord.js";

export interface CommandOptions {
    name: String,
    description: String,
    category: String,
    usage?: String,
    aliases?: string[],
    enabled: Boolean,
    ownerOnly?: boolean,
    guildOnly?: boolean,
    nsfwOnly?: boolean,
    cooldown?: Number,
    userPermissions?: PermissionString[],
    clientPermissions?: PermissionString[],
    run: (message: Message, args: String[]) => unknown | Promise<unknown>
};

export type CommandType = Omit<CommandOptions, 'run'>;

export interface EventOptions {
    name: string,
    once?: boolean,
};