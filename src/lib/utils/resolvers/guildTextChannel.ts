import type { Nullish } from '@sapphire/utilities';
import { type Channel, type Guild, type TextChannel, ChannelType } from 'discord.js';
import { resolveGuildChannel } from './guildChannel.js';
import { Identifiers } from '#lib/errors/Identifiers';
import { UserError } from '#lib/errors/UserError';

export function resolveGuildTextChannel(parameter: string, guild: Guild) {
	const result = resolveGuildChannel(parameter, guild);
	if (isTextChannel(result)) return result;
	throw new UserError({ identifier: Identifiers.ArgumentGuildTextChannelError }, 'Invalid TextChannel');
}

function isTextChannel(channel: Channel | Nullish): channel is TextChannel {
	return channel?.type === ChannelType.GuildText;
}
