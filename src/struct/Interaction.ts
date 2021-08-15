import { ApplicationCommandPermissionData, Interaction, PermissionString } from 'discord.js';
import { Categories, InteractionType } from '../typings/Options';
import { CobaltClient } from './cobaltClient';

abstract class InteractionCommand {
	public name: string;
	public category: Categories;
	public devOnly: boolean;
	public permissions: ApplicationCommandPermissionData[];
	public userPermissions: PermissionString[];
	public clientPermissions: PermissionString[];
	public abstract cobalt: CobaltClient;

	constructor(options: InteractionType) {
		this.name = options.name;
		this.category = options.category;
		this.devOnly = options.devOnly ?? false;
		this.permissions = options.permissions ?? [];
		this.userPermissions = options.userPermissions ?? ['SEND_MESSAGES'];
		this.clientPermissions = options.clientPermissions ?? ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'];
	}

	public abstract run(interactions: Interaction): unknown | Promise<unknown>;
}

export default InteractionCommand;
