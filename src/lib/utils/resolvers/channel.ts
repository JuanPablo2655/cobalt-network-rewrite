import { Identifiers, UserError } from '#lib/errors';
import { ChannelMentionRegex } from '@sapphire/discord-utilities';
import type { Message, Snowflake } from 'discord.js';

export function resolveChannel(parameter: string, message: Message) {
	const channelId = (ChannelMentionRegex.exec(parameter)?.[1] ?? parameter) as Snowflake;
	const channel = (message.guild ? message.guild.channels : message.client.channels).cache.get(channelId);
	if (channel) return channel;
	throw new UserError({ identifier: Identifiers.ArgumentChannelError }, 'Invalid Channel');
}
