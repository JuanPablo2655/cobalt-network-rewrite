import { ApplicationCommandPermissionData, Interaction } from 'discord.js';
import { InteractionCommandType } from '../typings/CommandOptions';
import BaseCommand from './BaseCommand';

abstract class InteractionCommand extends BaseCommand {
	public permissions: ApplicationCommandPermissionData[];

	constructor(options: InteractionCommandType) {
		super(options);
		this.permissions = options.permissions ?? [];
	}

	public abstract run(interactions: Interaction): unknown | Promise<unknown>;
}

export default InteractionCommand;
