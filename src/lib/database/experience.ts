import type { Message } from 'discord.js';
import { getOrCreateUser, updateUser } from '#lib/database';

/**
 * Add xp to the user
 *
 * @param id - The user Id
 * @param amount - Amount of xp to add
 */
export async function addXp(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		return updateUser(id, { xp: user.xp + amount, totalXp: user.totalXp + amount });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Remove xp from the user
 *
 * @param id - The user Id
 * @param amount - Amount of xp to remove
 * @param levelUp - If levelUp is true then don't remove from totalXp
 */
export async function removeXp(id: string, amount: number, levelUp: boolean) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (levelUp) return updateUser(id, { xp: user.xp - amount });
		return updateUser(id, { xp: user.xp - amount, totalXp: user.totalXp - amount });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Add level to the user
 *
 * @param id - The user Id
 * @param amount - Amount of level to add
 */
export async function addLevel(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		return updateUser(id, { level: user.level + amount });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Remove level from the user
 *
 * @param id - The user Id
 * @param amount - Amount of level to remove
 */
export async function removeLevel(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		return updateUser(id, { level: user.level - amount });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Get the next level xp
 *
 * @param level - The user level
 */
export function nextLevel(level: number) {
	if (Number.isNaN(level)) throw new TypeError('Level must be a number.');
	if (level < 0) throw new TypeError('Must be more than or equal to zero.');
	return 5 * level ** 2 + 50 * level + 100;
}

/**
 * Award xp to the user
 *
 * @param message - The message object
 * @returns If the user leveled up
 */
export async function rewardXp(message: Message) {
	try {
		const user = await getOrCreateUser(message.author.id);
		const xp = Math.round(Math.random() * 11 + 15);
		const nextLevelXp = nextLevel(user.level);
		if (user.xp + xp >= nextLevelXp) {
			await addLevel(message.author.id, 1);
			await removeXp(message.author.id, nextLevelXp, true);
			await addXp(message.author.id, xp);
			return true;
		} else {
			await addXp(message.author.id, xp);
			return false;
		}
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}
