import type { Member } from '@prisma/client';
import { logger } from '#lib/structures';
import { container } from '#root/Container';

const { db } = container;

/**
 * Create a member entry to the database
 *
 * @param userId - the user Id
 * @param guildId - the guild Id
 * @param data - the data to create the member with
 */
export async function createMember(
	userId: string,
	guildId: string,
	data?: Partial<Omit<Member, 'guildId' | 'userId'>>,
) {
	try {
		return db.member.create({
			data: {
				user: {
					connectOrCreate: { where: { id: userId }, create: { id: userId } },
				},
				guild: {
					connectOrCreate: { where: { id: guildId }, create: { id: guildId } },
				},
				...data,
			},
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Get a member entry from the database or create one if it doesn't exist
 *
 * @param userId - the user Id
 * @param guildId - the guild Id
 * @param data - the data to create the member with if it doesn't exist
 */
export async function getOrCreateMember(
	userId: string,
	guildId: string,
	data?: Partial<Omit<Member, 'guildId' | 'userId'>>,
) {
	try {
		return (await getMember(userId, guildId)) ?? (await createMember(userId, guildId, data));
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Delete a member entry from the database
 *
 * @param userId - the user Id
 * @param guildId - the guild Id
 */
export async function deleteMember(userId: string, guildId: string) {
	try {
		return db.member.delete({
			where: { MemberId: { userId, guildId } },
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Get a member entry from the database
 *
 * @param userId - the user Id
 * @param guildId - the guild Id
 */
export async function getMember(userId: string, guildId: string) {
	try {
		return db.member.findUniqueOrThrow({
			where: { MemberId: { userId, guildId } },
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Update a member entry in the database
 *
 * @param userId - the user Id
 * @param guildId - the guild Id
 * @param data - the data to update the member with
 */
export async function updateMember(
	userId: string,
	guildId: string,
	data?: Partial<Omit<Member, 'guildId' | 'userId'>>,
) {
	try {
		return db.member.update({
			where: { MemberId: { userId, guildId } },
			data: {
				...data,
			},
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}
