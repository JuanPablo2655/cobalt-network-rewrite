import { Identifiers } from '#lib/errors/Identifiers.js';
import { UserError } from '#lib/errors/UserError.js';
import { Nullish } from '@sapphire/utilities';
import { type Channel, ChannelType, type Guild, type TextChannel } from 'discord.js';
import { resolveGuildChannel } from './guildChannel.js';

export function resolveGuildTextChannel(parameter: string, guild: Guild) {
	const result = resolveGuildChannel(parameter, guild);
	if (isTextChannel(result)) return result;
	throw new UserError({ identifer: Identifiers.ArgumentGuildTextChannelError }, 'Invalid TextChannel');
}

function isTextChannel(channel: Channel | Nullish): channel is TextChannel {
	return channel?.type === ChannelType.GuildText;
}
