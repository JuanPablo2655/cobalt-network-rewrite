import { ClientEvents } from 'discord.js';

export interface EventOptions {
	/**
	 * name for the event
	 */
	name: keyof ClientEvents;

	/**
	 * option to make it run once
	 * @default false
	 */
	once?: boolean;
}
