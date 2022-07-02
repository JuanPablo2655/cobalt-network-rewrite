import { ClientEvents } from 'discord.js';
import { ListenerType } from '../../typings/Options.js';
import { CobaltClient } from '../../CobaltClient.js';

export abstract class Listener {
	/**
	 * name for the listener
	 */
	public name: keyof ClientEvents;

	/**
	 * option to make it run once
	 */
	public once: boolean;

	public abstract cobalt: CobaltClient;

	/**
	 * Constructs an listener
	 * @param options Optional listener settings other than name
	 */
	constructor(options: ListenerType) {
		this.name = options.name;
		this.once = options.once ?? false;
	}

	/**
	 * Executes the listener's logic
	 * @param args The listener parameters
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any[]): void | Promise<void>;
}
