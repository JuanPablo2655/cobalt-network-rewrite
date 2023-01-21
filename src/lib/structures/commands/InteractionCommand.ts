import type { ApplicationCommandPermissions, ChatInputCommandInteraction } from 'discord.js';
import type { InteractionCommandType } from '../../typings/CommandOptions.js';
import { BaseCommand } from './BaseCommand.js';

export abstract class InteractionCommand extends BaseCommand {
	/**
	 * The interaction permission
	 */
	public permissions: ApplicationCommandPermissions[];

	public constructor(options: InteractionCommandType) {
		super(options);
		this.permissions = options.permissions ?? [];
	}

	/**
	 * Executes the interaction command's logic
	 *
	 * @param interactions - The interaction that triggered the command
	 */
	public abstract run(interactions: ChatInputCommandInteraction<'cached'>): Promise<unknown> | unknown;
}
