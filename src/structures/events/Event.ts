import { ClientEvents } from 'discord.js';
import { EventOptions } from '../../typings/Options';
import { CobaltClient } from '../../lib/cobaltClient';

export abstract class Event {
	public name: keyof ClientEvents;
	public type: boolean;
	public abstract cobalt: CobaltClient;

	constructor(options: EventOptions) {
		this.name = options.name;
		this.type = options.once ?? false;
	}

	public abstract run(...args: any[]): void | Promise<void>;
}