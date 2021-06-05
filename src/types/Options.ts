import { ApplicationCommandOptionData, ClientEvents, Interaction, Message, PermissionString } from "discord.js";

export interface CommandOptions {
    name: string,
    description: string,
    category: string,
    usage?: string,
    aliases?: string[],
    enabled?: boolean,
    ownerOnly?: boolean,
    devOnly?: boolean
    guildOnly?: boolean,
    nsfwOnly?: boolean,
    cooldown?: number,
    userPermissions?: PermissionString[],
    clientPermissions?: PermissionString[],
    run: (message: Message, args: string[], addCD: Function) => unknown | Promise<unknown>
};

export interface InteractionCommandOptions {
    name: string,
    descrition?: string,
    options?: ApplicationCommandOptionData[],
    run: (interactions: Interaction, args: (string | number | boolean | undefined)[]) => unknown | Promise<unknown>
}

export type CommandType = Omit<CommandOptions, 'run'>;
export type InteractionType = Omit<InteractionCommandOptions, 'run'>;

export interface EventOptions {
    name: keyof ClientEvents,
    once?: boolean,
};