import { Message, PermissionString } from 'discord.js';
import { Categories, CommandType } from '../typings/Options';
import { CobaltClient } from './cobaltClient';

abstract class GenericCommand {
	public name: string;
	public description: string;
	public category: Categories;
	public usage: string;
	public aliases: string[];
	public enabled: boolean;
	public ownerOnly: boolean;
	public devOnly: boolean;
	public guildOnly: boolean;
	public nsfwOnly: boolean;
	public cooldown: number;
	public userPermissions: PermissionString[];
	public clientPermissions: PermissionString[];
	public abstract cobalt: CobaltClient;

	constructor(options: CommandType) {
		this.name = options.name;
		this.description = options.description;
		this.category = options.category;
		this.usage = options.usage ?? '';
		this.aliases = options.aliases ?? [];
		this.enabled = options.enabled ?? true;
		this.ownerOnly = options.ownerOnly ?? false;
		this.devOnly = options.devOnly ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.nsfwOnly = options.nsfwOnly ?? false;
		this.cooldown = options.cooldown ?? 1;
		this.userPermissions = options.userPermissions ?? ['SEND_MESSAGES'];
		this.clientPermissions = options.clientPermissions ?? ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'];
	}

	public abstract run(message: Message, args: string[], addCD: () => Promise<void>): unknown | Promise<unknown>;
}

export default GenericCommand;
