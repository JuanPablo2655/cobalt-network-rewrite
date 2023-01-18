import type { Bot } from '@prisma/client';
import { logger } from '#lib/structures';
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
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
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
		return (await getBot(id)) ?? (await createBot(id, data));
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
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
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
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
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
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
		return db.bot.update({
			where: { id },
			data: {
				...data,
			},
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}
