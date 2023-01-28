import type { Bot } from '@prisma/client';
import { container } from '#root/Container';

const { db } = container;

/**
 * Create a bot entry to the database
 *
 * @param id - The bot Id
 * @param data - The data to create the bot with
 */
export async function createBot(id: string, data?: Partial<Omit<Bot, 'id'>>) {
	try {
		return db.bot.create({
			data: {
				id,
				...data,
			},
		});
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Get a bot entry from the database or create one if it doesn't exist
 *
 * @param id - The bot Id
 * @param data - The data to create the bot with if it doesn't exist
 */
export async function getOrCreateBot(id: string, data?: Partial<Omit<Bot, 'id'>>) {
	try {
		return await getBot(id).catch(async () => createBot(id, data));
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Delete a bot entry from the database
 *
 * @param id - The bot Id
 */
export async function deleteBot(id: string) {
	try {
		return db.bot.delete({
			where: { id },
		});
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Get a bot entry from the database
 *
 * @param id - The bot Id
 */
export async function getBot(id: string) {
	try {
		return db.bot.findUniqueOrThrow({
			where: { id },
		});
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Update a bot entry in the database
 *
 * @param id - The bot Id
 * @param data - The data to update the bot with
 */
export async function updateBot(id: string, data?: Partial<Omit<Bot, 'id'>>) {
	try {
		return db.bot.upsert({
			create: {
				id,
				...data,
			},
			update: {
				...data,
			},
			where: { id },
		});
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}
