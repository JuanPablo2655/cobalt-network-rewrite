import { Message, PermissionString } from "discord.js";

export interface CommandOptions {
    name: string,
    description: string,
    category: string,
    usage?: string,
    aliases?: string[],
    enabled?: boolean,
    ownerOnly?: boolean,
    guildOnly?: boolean,
    nsfwOnly?: boolean,
    cooldown?: number,
    userPermissions?: PermissionString[],
    clientPermissions?: PermissionString[],
    run: (message: Message, args: string[], addCD: Function) => unknown | Promise<unknown>
};

export type CommandType = Omit<CommandOptions, 'run'>;

export interface EventOptions {
    name: string,
    once?: boolean,
};