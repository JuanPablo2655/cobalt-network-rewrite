import type { ClientEvents } from 'discord.js';

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

	/**
	 * Executes the listener's logic
	 * @param args The listener parameters
	 */
	run: (...args: unknown[]) => void | Promise<void>;
}

export type ListenerType = Omit<ListenerOptions, 'run'>;
