import { CobaltClient } from '../CobaltClient';
import * as DJS from 'discord.js';
import { diffWordsWithSpace, diffLines, Change } from 'diff';
import { GenericCommand, InteractionCommand, Listener, logger } from '#lib/structures';
import { resolve } from 'node:path';
import process from 'node:process';
import { isClass } from '@sapphire/utilities';

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

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
		const arg = args[options?.index ?? 0]?.replace?.(/[<@!>]/gi, '') || args[options?.index ?? 0];
		const mention =
			message.mentions?.users.first()?.id !== client.user?.id
				? message.mentions?.users.first()
				: message.mentions?.users.first(1)[1];

		const member: DJS.GuildMember | null =
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

export interface ImageAttachment {
	url: string;
	proxyURL: string;
	height: number;
	width: number;
}

/**
 * Get a image attachment from a message
 * @param message The Message instance to get the image url from
 */
export function getAttachment(message: DJS.Message): ImageAttachment | null {
	if (message.attachments.size) {
		const attachment = message.attachments.find(att => IMAGE_EXTENSION.test(att.url));
		if (attachment) {
			return {
				url: attachment.url,
				proxyURL: attachment.proxyURL,
				height: attachment.height!,
				width: attachment.width!,
			};
		}
	}
	for (const embed of message.embeds) {
		if (embed.image) {
			return {
				url: embed.image.url,
				proxyURL: embed.image.proxyURL!,
				height: embed.image.height!,
				width: embed.image.width!,
			};
		}
	}

	return null;
}

/**
 * Get the image url from a message
 * @param message The Message instance to get the image url from
 */
export function getImage(message: DJS.Message) {
	const attachment = getAttachment(message);
	return attachment ? attachment.proxyURL || attachment.url : null;
}

/**
 * Calculate a muliplier for a user
 * @param user The user from to calculate the multiplier
 * @param client Cobalt client
 * @returns Returns a whole number ex. 6%
 */
export async function calcMulti(user: DJS.User, client: CobaltClient): Promise<number> {
	let multi = 0;
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

/**
 * Remove all the duplicates from an array
 * @param array The array that contains the duplicates
 * @returns A new array with no duplicates
 */
export function removeDuplicates<T>(array: Array<T>) {
	return [...new Set(array)];
}

export type Structures = Listener | GenericCommand | InteractionCommand;

export async function resolveFile<T>(file: string) {
	const resolvedPath = resolve(process.cwd(), file);
	const File = await (await import(resolvedPath)).default;
	if (!isClass(File)) return null;
	return new File() as T;
}

export function validateFile(file: string, item: Structures) {
	if (!item.name) throw new Error(`Missing name ${file}`);
	if (!item.run) throw new Error(`Missing run function ${file}`);
}
