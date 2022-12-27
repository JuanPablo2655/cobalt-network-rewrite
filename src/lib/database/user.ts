import { container } from '#root/Container';
import { logger } from '#lib/structures';
import { User } from '@prisma/client';
const { db } = container;

/**
 * Create a user entry to the database
 * @param id The user Id
 * @param data The data to create the user with
 */
export async function createUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return await db.user.create({
			data: {
				id,
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Delete a user entry from the database
 * @param id The user Id
 */
export async function deleteUser(id: string) {
	try {
		return await db.user.delete({ where: { id } });
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Get a user entry from the database
 * @param id The user Id
 */
export async function getUser(id: string) {
	try {
		return await db.user.findUniqueOrThrow({ where: { id } });
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Update a user entry in the database
 * @param id The user Id
 * @param data The data to update the user with
 */
export async function updateUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return await db.user.update({
			where: { id },
			data: {
				...data,
			},
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}
