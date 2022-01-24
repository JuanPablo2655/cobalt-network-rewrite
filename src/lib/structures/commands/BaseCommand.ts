import { PermissionString } from 'discord.js';
import { BaseCommandOptions, Categories } from '../../typings/CommandOptions';
import { CobaltClient } from '../../cobaltClient';

export abstract class BaseCommand {
	/**
	 * The name for the command
	 */
	public name: string;

	/**
	 * Category in which the command belongs to
	 */
	public category: Categories;

	/**
	 * Option to make it developer only
	 */
	public devOnly: boolean;

	/**
	 * The permissions the user needs to run the command
	 */
	public userPermissions: PermissionString[];

	/**
	 * The permission the client needs to properly run
	 */
	public clientPermissions: PermissionString[];

	public abstract cobalt: CobaltClient;

	/**
	 * Constructs a BaseCommand
	 * @param options Optional Command settings other than name and category
	 */
	constructor(options: BaseCommandOptions) {
		this.name = options.name;
		this.category = options.category;
		this.devOnly = options.devOnly ?? false;
		this.userPermissions = options.userPermissions ?? [];
		this.clientPermissions = options.clientPermissions ?? [];
	}
}
