import { type Snowflake, Collection } from 'discord.js';
import type { GenericCommandOptions, InteractionCommandOptions, ListenerOptions } from '#lib/typings';

export interface Container {
	commands: Collection<string, GenericCommandOptions>;
	cooldowns: Collection<string, Collection<string, number>>;
	interactions: Collection<string, InteractionCommandOptions>;
	listeners: Collection<string, ListenerOptions>;
	voice: Map<Snowflake, number>;
}

// @ts-expect-error: injected variables not initiated yet
export const container: Container = {
	commands: new Collection<string, GenericCommandOptions>(),
	cooldowns: new Collection<string, Collection<string, number>>(),
	interactions: new Collection<string, InteractionCommandOptions>(),
	listeners: new Collection<string, ListenerOptions>(),
	voice: new Map<Snowflake, number>(),
};
