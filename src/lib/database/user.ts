import type { User } from '@prisma/client';
import { container } from '#root/Container';

const { db } = container;

/**
 * Create a user entry to the database
 *
 * @param id - The user Id
 * @param data - The data to create the user with
 */
export async function createUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return db.user.create({
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
 * Get a user entry from the database or create one if it doesn't exist
 *
 * @param id - The user Id
 * @param data - The data to create the user with if it doesn't exist
 */
export async function getOrCreateUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return await getUser(id).catch(async () => createUser(id, data));
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Delete a user entry from the database
 *
 * @param id - The user Id
 */
export async function deleteUser(id: string) {
	try {
		return db.user.delete({ where: { id } });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Get a user entry from the database
 *
 * @param id - The user Id
 */
export async function getUser(id: string) {
	try {
		return db.user.findUniqueOrThrow({ where: { id } });
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
	}
}

/**
 * Update a user entry in the database
 *
 * @param id - The user Id
 * @param data - The data to update the user with
 */
export async function updateUser(id: string, data?: Partial<Omit<User, 'id'>>) {
	try {
		return db.user.upsert({
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
