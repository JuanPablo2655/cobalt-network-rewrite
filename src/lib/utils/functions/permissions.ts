import { OWNERS } from '#root/config';
import { GuildMember, PermissionsBitField } from 'discord.js';

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
	return member.permissions.has(PermissionsBitField.Flags.BanMembers);
}

export function checkAdministrator(member: GuildMember) {
	return member.permissions.has(PermissionsBitField.Flags.ManageGuild);
}
