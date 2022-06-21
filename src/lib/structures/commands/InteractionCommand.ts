import { ApplicationCommandPermissions, ChatInputCommandInteraction } from 'discord.js';
import { InteractionCommandType } from '../../typings/CommandOptions';
import { BaseCommand } from './BaseCommand';

export abstract class InteractionCommand extends BaseCommand {
	/**
	 * The interaction permission
	 */
	public permissions: ApplicationCommandPermissions[];

	constructor(options: InteractionCommandType) {
		super(options);
		this.permissions = options.permissions ?? [];
	}

	/**
	 * Executes the interaction command's logic
	 * @param interactions The interaction that triggered the command
	 */
	public abstract run(interactions: ChatInputCommandInteraction<'cached'>): unknown | Promise<unknown>;
}
