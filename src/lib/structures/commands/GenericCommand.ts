import type { Message } from 'discord.js';
import type { GenericCommandType } from '../../typings/CommandOptions.js';
import { BaseCommand } from './BaseCommand.js';
import { seconds } from '#utils/common';

export abstract class GenericCommand extends BaseCommand {
	/**
	 * The description for the command
	 */
	public description: string;

	/**
	 * description on how to use the command
	 */
	public usage: string;

	/**
	 * The alias used to run this command
	 */
	public aliases: string[];

	/**
	 * Whether the command is enabled globally or not
	 */
	public enabled: boolean;

	/**
	 * Whether the command is owner only or not
	 */
	public ownerOnly: boolean;

	/**
	 * Whether the command is guild only or not
	 */
	public guildOnly: boolean;

	/**
	 * Whether the command is nsfw
	 *
	 * The command only works in channels marked as nsfw
	 */
	public nsfwOnly: boolean;

	/**
	 * How long the cooldown is in milliseconds
	 */
	public cooldown: number;

	/**
	 * Constructs a GenericCommand
	 *
	 * @param options - Optional Command settings other than name, category, and description
	 */
	public constructor(options: GenericCommandType) {
		super(options);
		this.description = options.description;
		this.usage = options.usage ?? '';
		this.aliases = options.aliases ?? [];
		this.enabled = options.enabled ?? true;
		this.ownerOnly = options.ownerOnly ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.nsfwOnly = options.nsfwOnly ?? false;
		this.cooldown = options.cooldown ?? seconds(1);
		this.userPermissions = options.userPermissions ?? ['SendMessages'];
		this.clientPermissions = options.clientPermissions ?? ['SendMessages', 'ReadMessageHistory', 'EmbedLinks'];
	}

	/**
	 * Executes the message command's logic
	 *
	 * @param message - The message that triggered the command
	 * @param args - The parsed arguments
	 * @param addCD - Adds cooldown to the user
	 */
	public abstract run(message: Message, args: string[], addCD: () => Promise<void>): Promise<unknown> | unknown;
}
