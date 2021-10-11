import { ApplicationCommandPermissionData, Interaction, Message, PermissionString } from 'discord.js';

export type Categories = 'dev' | 'economy' | 'experience' | 'settings' | 'utility' | 'admin';

export interface BaseCommandOptions {
	name: string;
	category: Categories;
	devOnly?: boolean;
	userPermissions?: PermissionString[];
	clientPermissions?: PermissionString[];
}

export interface InteractionCommandOptions extends BaseCommandOptions {
	permissions?: ApplicationCommandPermissionData[];
	run: (interactions: Interaction) => unknown | Promise<unknown>;
}

export type InteractionCommandType = Omit<InteractionCommandOptions, 'run'>;

export interface GenericCommandOptions extends BaseCommandOptions {
	description: string;
	usage?: string;
	aliases?: string[];
	enabled?: boolean;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	nsfwOnly?: boolean;
	cooldown?: number;
	run: (message: Message, args: string[], addCD: () => Promise<void>) => unknown | Promise<unknown>;
}

export type GenericCommandType = Omit<GenericCommandOptions, 'run'>;
