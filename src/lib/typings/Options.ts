import { ClientEvents } from 'discord.js';

export interface ListenerOptions {
	/**
	 * name for the Listener
	 */
	name: keyof ClientEvents;

	/**
	 * option to make it run once
	 * @default false
	 */
	once?: boolean;
}
