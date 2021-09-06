import { ClientEvents } from 'discord.js';

export interface EventOptions {
	name: keyof ClientEvents;
	once?: boolean;
}
