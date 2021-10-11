import { PermissionString } from 'discord.js';
import { BaseCommandOptions, Categories } from '../typings/CommandOptions';
import { CobaltClient } from './cobaltClient';

abstract class BaseCommand {
	public name: string;
	public category: Categories;
	public devOnly: boolean;
	public userPermissions: PermissionString[];
	public clientPermissions: PermissionString[];
	public abstract cobalt: CobaltClient;
	constructor(options: BaseCommandOptions) {
		this.name = options.name;
		this.category = options.category;
		this.devOnly = options.devOnly ?? false;
		this.userPermissions = options.userPermissions ?? [];
		this.clientPermissions = options.clientPermissions ?? [];
	}
}

export default BaseCommand;
