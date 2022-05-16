import { OWNERS } from '#root/config';
import { GuildMember, Permissions } from 'discord.js';

export function isOwner(member: GuildMember) {
	return OWNERS.includes(member.id);
}

export function isGuildOwner(member: GuildMember) {
	return member.id === member.guild.ownerId;
}

export function isAdmin(member: GuildMember) {
	return isGuildOwner(member) || checkAdministrator(member);
}

export function isModerator(member: GuildMember) {
	return isGuildOwner(member) || checkAdministrator(member) || checkModerator(member);
}

export function checkModerator(member: GuildMember) {
	return member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
}

export function checkAdministrator(member: GuildMember) {
	return member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);
}
