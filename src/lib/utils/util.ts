import { CobaltClient } from '../CobaltClient.js';
import * as DJS from 'discord.js';
import { diffWordsWithSpace } from 'diff';
import { GenericCommand, InteractionCommand, Listener } from '#lib/structures';
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
	return diffWordsWithSpace(DJS.escapeMarkdown(oldString), DJS.escapeMarkdown(newString))
		.map(result => (result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value))
		.join('');
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
		if (embed.thumbnail) {
			return {
				url: embed.thumbnail.url,
				proxyURL: embed.thumbnail.proxyURL!,
				height: embed.thumbnail.height!,
				width: embed.thumbnail.width!,
			};
		}
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
export function removeDuplicates<T>(array: T[]) {
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
