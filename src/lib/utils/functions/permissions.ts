import { OWNERS } from '#root/config';
import { GuildMember } from 'discord.js';

export function isOwner(member: GuildMember) {
	return OWNERS.includes(member.id);
}

export function isGuildOwner(member: GuildMember) {
	return member.id === member.guild.ownerId;
}
