import { RoleMentionRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import type { Guild, Role, Snowflake } from 'discord.js';
import { Identifiers, UserError } from '#lib/errors';

export async function resolveRole(parameter: string, guild: Guild) {
	const role = (await resolveById(parameter, guild)) ?? resolveByQuery(parameter, guild);
	if (role) return role;
	throw new UserError({ identifier: Identifiers.ArgumentRoleError }, 'Invalid Role');
}

async function resolveById(argument: string, guild: Guild): Promise<Role | null> {
	const roleId = RoleMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	return roleId ? guild.roles.fetch(roleId[1] as Snowflake) : null;
}

function resolveByQuery(argument: string, guild: Guild): Role | null {
	const lowerCaseArgument = argument.toLowerCase();
	return guild.roles.cache.find(role => role.name.toLowerCase() === lowerCaseArgument) ?? null;
}
