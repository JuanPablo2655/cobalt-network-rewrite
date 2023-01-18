import type { GenericCommandOptions, InteractionCommandOptions, ListenerOptions } from '#lib/typings';
import { Collection, Snowflake } from 'discord.js';

export interface Container {
	commands: Collection<string, GenericCommandOptions>;
	cooldowns: Collection<string, Collection<string, number>>;
	listeners: Collection<string, ListenerOptions>;
	interactions: Collection<string, InteractionCommandOptions>;
	voice: Map<Snowflake, number>;
}

// @ts-expect-error: injected variables not initiated yet
export const container: Container = {
	commands: new Collection<string, GenericCommandOptions>(),
	cooldowns: new Collection<string, Collection<string, number>>(),
	listeners: new Collection<string, ListenerOptions>(),
	interactions: new Collection<string, InteractionCommandOptions>(),
	voice: new Map<Snowflake, number>(),
};
