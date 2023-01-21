import { SnowflakeRegex, UserOrMemberMentionRegex } from '@sapphire/discord-utilities';
import type { Guild, Snowflake } from 'discord.js';
import { Identifiers, UserError } from '#lib/errors';

export async function resolveMember(parameter: string, guild: Guild) {
	const member = (await resolveById(parameter, guild)) ?? (await resolveByQuery(parameter, guild));
	if (member) return member;
	throw new UserError({ identifier: Identifiers.ArgumentMemberError }, 'Invalid Member');
}

async function resolveById(argument: string, guild: Guild) {
	const memberId = UserOrMemberMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	// eslint-disable-next-line promise/prefer-await-to-then
	return memberId ? guild.members.fetch(memberId[1] as Snowflake).catch(() => null) : null;
}

async function resolveByQuery(argument: string, guild: Guild) {
	// eslint-disable-next-line no-param-reassign
	argument = argument.length > 5 && argument.at(-5) === '#' ? argument.slice(0, -5) : argument;

	const member = await guild.members.fetch({ query: argument, limit: 1 }).catch(() => null);
	return member?.first() ?? null;
}
