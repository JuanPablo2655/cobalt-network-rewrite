import { Identifiers, UserError } from '#lib/errors';
import { ChannelMentionRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import type { Guild, GuildBasedChannel, Snowflake } from 'discord.js';

export function resolveGuildChannel(parameter: string, guild: Guild) {
	const channel = resolveById(parameter, guild) ?? resolveByQuery(parameter, guild);
	if (channel) return channel;
	throw new UserError({ identifier: Identifiers.ArgumentGuildChannelError }, 'Invalid GuildChannel');
}

function resolveById(argument: string, guild: Guild) {
	const channelId = ChannelMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	return channelId ? (guild.channels.cache.get(channelId[1] as Snowflake) as GuildBasedChannel) ?? null : null;
}

function resolveByQuery(argument: string, guild: Guild) {
	const lowerCaseArgument = argument.toLowerCase();
	return (
		(guild.channels.cache.find(channel => channel.name.toLowerCase() === lowerCaseArgument) as GuildBasedChannel) ??
		null
	);
}
