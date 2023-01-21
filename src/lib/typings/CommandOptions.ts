/* eslint-disable tsdoc/syntax */
import type {
	ApplicationCommandPermissions,
	ChatInputCommandInteraction,
	Message,
	PermissionsString,
} from 'discord.js';

export type Categories = 'admin' | 'dev' | 'economy' | 'experience' | 'settings' | 'utility';

/**
 * The {@link BaseCommand} options
 */
export interface BaseCommandOptions {
	/**
	 * The name for the command
	 */
	name: string;

	/**
	 * Category in which the command belongs to
	 */
	category: Categories;

	/**
	 * Option to make the command developer only
	 *
	 * @default false
	 */
	devOnly?: boolean;

	/**
	 * The permissions the user needs to run the command
	 *
	 * @default []
	 */
	userPermissions?: PermissionsString[];

	/**
	 * The permission the client needs to properly run
	 *
	 * @default []
	 */
	clientPermissions?: PermissionsString[];
}

/**
 * The {@link InteractionCommand} options
 */
export interface InteractionCommandOptions extends BaseCommandOptions {
	/**
	 * The interaction permission
	 *
	 * @default []
	 */
	permissions?: ApplicationCommandPermissions[];

	/**
	 * Executes the interaction command's logic
	 *
	 * @param interactions - The interaction that triggered the command
	 */
	run(interactions: ChatInputCommandInteraction<'cached'>): Promise<unknown> | unknown;
}

export type InteractionCommandType = Omit<InteractionCommandOptions, 'run'>;

/**
 * The {@link GenericCommand} options
 */
export interface GenericCommandOptions extends BaseCommandOptions {
	/**
	 * The description for the command
	 */
	description: string;

	/**
	 * description on how to use the command
	 *
	 * @default ''
	 */
	usage?: string;

	/**
	 * The alias used to run this command
	 *
	 * @default ''
	 */
	aliases?: string[];

	/**
	 * Whether the command is enabled globally or not
	 *
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * Whether the command is owner only or not
	 *
	 * @default false
	 */
	ownerOnly?: boolean;

	/**
	 * Whether the command is guild only or not
	 *
	 * @default false
	 */
	guildOnly?: boolean;

	/**
	 * Whether the command is nsfw
	 *
	 * The command only works in channels marked as nsfw
	 *
	 * @default false
	 */
	nsfwOnly?: boolean;

	/**
	 * How long the cooldown is in milliseconds
	 *
	 * @default seconds(1)
	 */
	cooldown?: number;

	/**
	 * Executes the message command's logic
	 *
	 * @param message - The message that triggered the command
	 * @param args - The parsed arguments
	 * @param addCD - Adds cooldown to the user
	 */
	run(message: Message, args: string[], addCD: () => Promise<void>): Promise<unknown> | unknown;
}

export type GenericCommandType = Omit<GenericCommandOptions, 'run'>;
