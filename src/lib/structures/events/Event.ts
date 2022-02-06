import { ClientEvents } from 'discord.js';
import { EventOptions } from '../../typings/Options';
import { CobaltClient } from '../../cobaltClient';

export abstract class Event {
	/**
	 * name for the event
	 */
	public name: keyof ClientEvents;

	// TODO(Isidro): rename type to once
	/**
	 * option to make it run once
	 */
	public type: boolean;

	public abstract cobalt: CobaltClient;

	/**
	 * Constructs an Event
	 * @param options Optional event settings other than name
	 */
	constructor(options: EventOptions) {
		this.name = options.name;
		this.type = options.once ?? false;
	}

	/**
	 * Executes the event's logic
	 * @param args The event parameters
	 */
	public abstract run(...args: any[]): void | Promise<void>;
}
