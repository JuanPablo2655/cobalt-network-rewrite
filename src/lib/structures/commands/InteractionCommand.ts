import { ApplicationCommandPermissionData, Interaction } from 'discord.js';
import { InteractionCommandType } from '../../typings/CommandOptions';
import { BaseCommand } from './BaseCommand';

export abstract class InteractionCommand extends BaseCommand {
	/**
	 * The interaction permission
	 */
	public permissions: ApplicationCommandPermissionData[];

	constructor(options: InteractionCommandType) {
		super(options);
		this.permissions = options.permissions ?? [];
	}

	/**
	 * Executes the interaction command's logic
	 * @param interactions The interaction that triggered the command
	 */
	public abstract run(interactions: Interaction): unknown | Promise<unknown>;
}
