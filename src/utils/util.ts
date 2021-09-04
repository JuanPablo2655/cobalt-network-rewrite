import { CobaltClient } from '../struct/cobaltClient';
import * as DJS from 'discord.js';
import { diffWordsWithSpace, diffLines, Change } from 'diff';

export function formatNumber(n: string | number): string {
	n += '';
	let x = (n as String).split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');
	return x1 + x2;
}

export function toCapitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function findMember(
	client: CobaltClient,
	message: Partial<DJS.Message>,
	args: string[],
	options?: { allowAuthor?: boolean; index?: number },
): Promise<DJS.GuildMember | undefined | null> {
	if (!(message.guild instanceof DJS.Guild)) return;

	try {
		let member: DJS.GuildMember | undefined | null;
		const arg = args[options?.index ?? 0]?.replace?.(/[<@!>]/gi, '') || args[options?.index ?? 0];
		const mention =
			message.mentions?.users.first()?.id !== client.user?.id
				? message.mentions?.users.first()
				: message.mentions?.users.first(1)[1];

		member =
			message.guild.members.cache.find(m => m.user.id === mention?.id) ||
			message.guild.members.cache.get(arg as DJS.Snowflake) ||
			message.guild.members.cache.find(m => m.user.id === args[options?.index ?? 0]) ||
			message.guild.members.cache.find(
				m =>
					m.user.username === args[options?.index ?? 0] ||
					m.user.username.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase()),
			) ||
			message.guild.members.cache.find(
				m =>
					m.displayName === args[options?.index ?? 0] ||
					m.displayName.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase()),
			) ||
			(message.guild.members.cache.find(
				m =>
					m.user.tag === args[options?.index ?? 0] ||
					m.user.tag.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase()),
			) as DJS.GuildMember) ||
			(options?.allowAuthor === true ? message.member : null);
		return member;
	} catch (err) {
		if (err instanceof DJS.DiscordAPIError ? err?.message?.includes('DiscordAPIError: Unknown Member') : null)
			return undefined;
		console.error(err);
	}
}

export async function findRole(message: DJS.Message, arg: string): Promise<DJS.Role | null> {
	if (!(message.guild instanceof DJS.Guild)) return null;
	return (
		message.mentions.roles.first() ||
		message.guild.roles.cache.get(arg as DJS.Snowflake) ||
		message.guild.roles.cache.find(r => r.name === arg) ||
		message.guild.roles.cache.find(r => r.name.startsWith(arg)) ||
		message.guild.roles.fetch(arg as DJS.Snowflake)
	);
}

export async function findChannel(message: DJS.Message, arg: string): Promise<DJS.TextChannel | null> {
	if (!(message.guild instanceof DJS.Guild)) return null;
	return (message.mentions.channels.first() ||
		message.guild.channels.cache.get(arg as DJS.Snowflake) ||
		message.guild.channels.cache.find(c => (c as DJS.TextChannel).name === arg) ||
		message.guild.channels.cache.find(c => (c as DJS.TextChannel).name.startsWith(arg))) as DJS.TextChannel;
}

export function trim(str: string, max: number) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

export function getDiff(oldString: string, newString: string): string {
	const setStyle = (string: string, style: string) => `${style}${string}${style}`;
	oldString.replace(/\*|~~/g, '');
	newString.replace(/\*|~~/g, '');
	const getSmallestString = (strings: string[]): string => {
		return strings.reduce((smallestString, currentString) =>
			currentString.length < smallestString.length ? currentString : smallestString,
		);
	};
	const diffs = [diffWordsWithSpace, diffLines].map((diffFunction): string =>
		diffFunction(oldString, newString).reduce((diffString: string, part: Change) => {
			diffString += setStyle(part.value, part.added ? '***' : part.removed ? '~~' : '');
			return diffString;
		}, ''),
	);
	return getSmallestString(diffs);
}

export function getImage(message: DJS.Message) {
	return message.attachments
		.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL))
		.map(({ proxyURL }) => proxyURL);
}

export async function calcMulti(user: DJS.User, client: CobaltClient): Promise<number> {
	let multi: number = 0;
	const member = client.guilds.cache.get('322505254098698240')?.members.cache.get(user.id);
	const roles = client.guilds.cache.get('322505254098698240')?.roles.cache;
	const director = roles?.get('355885679076442112');
	const patriot = roles?.get('513182271985942538');
	const citizen = roles?.get('513027436208848896');
	const funkyMonkey = roles?.get('812187141684985876');
	const booster = roles?.get('698994055954300959');
	if (!member) return multi;
	if (!roles) return multi;
	if (member.roles.cache.has(director!.id)) multi += 4; // 4%
	if (member.roles.cache.has(patriot!.id)) multi += 3; // 3%
	if (member.roles.cache.has(citizen!.id)) multi += 2; // 2%
	if (member.roles.cache.has(funkyMonkey!.id)) multi += 4; // 4%
	if (member.roles.cache.has(booster!.id)) multi += 4; // 6%
	return multi;
}

export function addMulti(amount: number, multi: number) {
	return Math.round(amount + amount * (multi / 100));
}
