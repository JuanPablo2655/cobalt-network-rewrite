import { diffWordsWithSpace } from 'diff';
import * as DJS from 'discord.js';

/**
 * Capitalize a sentence
 * @param str The string to capitalize
 */
export function toCapitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a certain length
 * @param str The string to truncate
 * @param max The max length of the string
 * @returns The truncated string minus the last 3 characters
 */
export function truncate(str: string, max: number) {
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
