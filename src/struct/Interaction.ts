import { ApplicationCommandOptionData, Interaction } from 'discord.js';
import { InteractionType } from '../typings/Options';
import { CobaltClient } from './cobaltClient';

abstract class InteractionCommand {
	public name: string;
	public description: string;
	public options: ApplicationCommandOptionData[] | undefined;
	public abstract cobalt: CobaltClient;

	constructor(options: InteractionType) {
		this.name = options.name;
		this.description = options.descrition ?? '';
		this.options = options.options;
	}

	public abstract run(interactions: Interaction): unknown | Promise<unknown>;
}

export default InteractionCommand;
