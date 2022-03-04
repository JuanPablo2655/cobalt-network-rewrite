import { ClientEvents } from 'discord.js';
import { EventOptions } from '../../typings/Options';
import { CobaltClient } from '../../CobaltClient';

export abstract class Event {
	/**
	 * name for the event
	 */
	public name: keyof ClientEvents;

	/**
	 * option to make it run once
	 */
	public once: boolean;

	public abstract cobalt: CobaltClient;

	/**
	 * Constructs an Event
	 * @param options Optional event settings other than name
	 */
	constructor(options: EventOptions) {
		this.name = options.name;
		this.once = options.once ?? false;
	}

	/**
	 * Executes the event's logic
	 * @param args The event parameters
	 */
	public abstract run(...args: any[]): void | Promise<void>;
}
