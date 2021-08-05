import { ApplicationCommandOptionData, Interaction, PermissionString } from 'discord.js';
import { Categories, InteractionType } from '../typings/Options';
import { CobaltClient } from './cobaltClient';

abstract class InteractionCommand {
	public name: string;
	public description: string;
	public category: Categories;
	public ownerOnly: boolean;
	public devOnly: boolean;
	public guildOnly: boolean;
	public nsfwOnly: boolean;
	public userPermissions: PermissionString[];
	public clientPermissions: PermissionString[];
	public options: ApplicationCommandOptionData[] | undefined;
	public abstract cobalt: CobaltClient;

	constructor(options: InteractionType) {
		this.name = options.name;
		this.description = options.descrition ?? '';
		this.category = options.category;
		this.ownerOnly = options.ownerOnly ?? false;
		this.devOnly = options.devOnly ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.nsfwOnly = options.nsfwOnly ?? false;
		this.userPermissions = options.userPermissions ?? ['SEND_MESSAGES'];
		this.clientPermissions = options.clientPermissions ?? ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'];
		this.options = options.options;
	}

	public abstract run(interactions: Interaction): unknown | Promise<unknown>;
}

export default InteractionCommand;
