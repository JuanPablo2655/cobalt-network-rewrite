import { CobaltClient } from '../cobaltClient';
import * as DJS from 'discord.js';
import { diffWordsWithSpace, diffLines, Change } from 'diff';
import { logger } from '#lib/structures';

/**
 * Format a number
 * @param n The number to format
 */
export function formatNumber(n: string | number): string | null {
	const number = Number.parseFloat(String(n)).toLocaleString('en-US');
	return number !== 'NaN' ? number : null;
}

/**
 * Format a number to currency format
 * @param n The number to format
 */
export function formatMoney(n: string | number): string | null {
	return formatNumber(n) !== null ? `₡ ${formatNumber(n)}` : null;
}

/**
 * Capitalize a sentence
 * @param str The string to capitalize
 */
export function toCapitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the GuildMember from message content
 * @param client Cobalt client
 * @param message Message in which to find the member
 * @param args Arguments provided in the command
 * @param options Option to include the author an the argument index
 * @returns Returns GuildMember
 */
export async function findMember(
	client: CobaltClient,
	message: Partial<DJS.Message>,
	args: string[],
	options?: { allowAuthor?: boolean; index?: number },
): Promise<DJS.GuildMember | null> {
	if (!(message.guild instanceof DJS.Guild)) return null;

	try {
		let member: DJS.GuildMember | null;
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
		// TODO(Isidro): refactor
		const error = err as Error;
		if (err instanceof DJS.DiscordAPIError ? err?.message?.includes('DiscordAPIError: Unknown Member') : null) {
			logger.error(error, error.message);
			return null;
		}
		return null;
	}
}

/**
 * Get the role form message content
 * @param message The message in which to find the role
 * @param arg Arguments provided in the command
 * @returns Returns Role
 */
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

/**
 * Get the channel from message content
 * @param message The message in which to find the channel
 * @param arg Arguments provided in the command
 * @returns Returns TextChannel
 */
export async function findChannel(message: DJS.Message, arg: string): Promise<DJS.TextChannel | null> {
	if (!(message.guild instanceof DJS.Guild)) return null;
	return (message.mentions.channels.first() ||
		message.guild.channels.cache.get(arg as DJS.Snowflake) ||
		message.guild.channels.cache.find(c => (c as DJS.TextChannel).name === arg) ||
		message.guild.channels.cache.find(c => (c as DJS.TextChannel).name.startsWith(arg))) as DJS.TextChannel;
}

/**
 * Trim a string to a certain length
 * @param str The string to trim
 * @param max The max length of the string
 */
export function trim(str: string, max: number) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

/**
 * Get the difference between the old and new content
 * @param oldString The old content
 * @param newString The new content
 */
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

/**
 * Get the image url from a message
 * @param message The Message instance to get the image url from
 */
// TODO(Isidro): refactor to return one image not an array
export function getImage(message: DJS.Message) {
	return message.attachments
		.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL))
		.map(({ proxyURL }) => proxyURL);
}

/**
 * Calculate a muliplier for a user
 * @param user The user from to calculate the multiplier
 * @param client Cobalt client
 * @returns Returns a whole number ex. 6%
 */
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

/**
 * Add a multiplier to an amount
 * @param amount The amount to add the multiplier to
 * @param multi The multiplier
 * @returns Amount plus multi
 */
export function addMulti(amount: number, multi: number) {
	return Math.round(amount + amount * (multi / 100));
}
