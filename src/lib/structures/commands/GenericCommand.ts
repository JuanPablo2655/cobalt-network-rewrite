import { Message } from 'discord.js';
import { GenericCommandType } from '../../typings/CommandOptions';
import { BaseCommand } from './BaseCommand';

export abstract class GenericCommand extends BaseCommand {
	public description: string;
	public usage: string;
	public aliases: string[];
	public enabled: boolean;
	public ownerOnly: boolean;
	public guildOnly: boolean;
	public nsfwOnly: boolean;
	public cooldown: number;

	constructor(options: GenericCommandType) {
		super(options);
		this.description = options.description;
		this.usage = options.usage ?? '';
		this.aliases = options.aliases ?? [];
		this.enabled = options.enabled ?? true;
		this.ownerOnly = options.ownerOnly ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.nsfwOnly = options.nsfwOnly ?? false;
		this.cooldown = options.cooldown ?? 1;
		this.userPermissions = options.userPermissions ?? ['SEND_MESSAGES'];
		this.clientPermissions = options.clientPermissions ?? ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'];
	}

	public abstract run(message: Message, args: string[], addCD: () => Promise<void>): unknown | Promise<unknown>;
}
