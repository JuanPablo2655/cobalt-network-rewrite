import { Ban, Leave, Level, Log, Welcome } from '@prisma/client';
import { container } from '#root/Container';
import { logger } from '#lib/structures';
const { db } = container;

async function queryGuild(id: string) {
	try {
		const ban = await db.ban.findUniqueOrThrow({ where: { id: id } });
		const welcome = await db.welcome.findUniqueOrThrow({ where: { id: id } });
		const leave = await db.leave.findUniqueOrThrow({ where: { id: id } });
		const level = await db.level.findUniqueOrThrow({ where: { id: id } });
		const log = await db.log.findUniqueOrThrow({ where: { id: id } });
		return { ban, welcome, leave, level, log };
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Create a guild entry to the database
 * @param guildId The guild Id
 * @param data The data to create the guild with
 */
export async function createGuild(id: string, data?: Partial<IGuild>) {
	try {
		const raw = await db.guild.create({
			data: {
				id,
				prefix: data?.prefix,
				blacklistedWords: data?.blacklistedWords,
				disabledCommands: data?.disabledCommands,
				disabledCategories: data?.disabledCategories,
				mutedRoleId: data?.mutedRoleId,
				level: {
					create: {
						message: data?.level?.message,
						enabled: data?.level?.enabled,
					},
				},
				welcome: {
					create: {
						message: data?.welcome?.message,
						channelId: data?.welcome?.channelId,
						enabled: data?.welcome?.enabled,
					},
				},
				leave: {
					create: {
						message: data?.leave?.message,
						channelId: data?.leave?.channelId,
						enabled: data?.leave?.enabled,
					},
				},
				ban: {
					create: {
						message: data?.ban?.message,
						enabled: data?.ban?.enabled,
					},
				},
				log: {
					create: {
						channelId: data?.log?.channelId,
						enabled: data?.log?.enabled,
						disabledEvents: data?.log?.disabledEvents,
					},
				},
			},
		});
		const half = await queryGuild(id);
		return { ...raw, ...half };
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Delete a guild entry from the database
 * @param id The guild Id
 */
export async function deleteGuild(id: string) {
	try {
		const half = await queryGuild(id);
		const raw = await db.guild.delete({ where: { id } });
		return { ...raw, ...half };
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Get a guild entry from the database
 * @param id The guild Id
 */
export async function getGuild(id: string) {
	try {
		const raw = await db.guild.findUniqueOrThrow({ where: { id } });
		const half = await queryGuild(id);
		return { ...raw, ...half };
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

/**
 * Update a guild entry in the database
 * @param id The guild Id
 * @param data The data to update the guild with
 */
export async function updateGuild(id: string, data?: Partial<IGuild>) {
	try {
		const raw = await db.guild.update({
			where: {
				id,
			},
			data: {
				prefix: data?.prefix,
				blacklistedWords: data?.blacklistedWords,
				disabledCommands: data?.disabledCommands,
				disabledCategories: data?.disabledCategories,
				mutedRoleId: data?.mutedRoleId,
				level: {
					update: {
						message: data?.level?.message,
						enabled: data?.level?.enabled,
					},
				},
				welcome: {
					update: {
						message: data?.welcome?.message,
						channelId: data?.welcome?.channelId,
						enabled: data?.welcome?.enabled,
					},
				},
				leave: {
					update: {
						message: data?.leave?.message,
						channelId: data?.leave?.channelId,
						enabled: data?.leave?.enabled,
					},
				},
				ban: {
					update: {
						message: data?.ban?.message,
						enabled: data?.ban?.enabled,
					},
				},
				log: {
					update: {
						channelId: data?.log?.channelId,
						enabled: data?.log?.enabled,
						disabledEvents: data?.log?.disabledEvents,
					},
				},
			},
		});
		const half = await queryGuild(id);
		return { ...raw, ...half };
	} catch (err) {
		const error = err as Error;
		logger.error(error, error.message);
	}
}

export interface IGuild {
	prefix: string;
	blacklistedWords: string[];
	disabledCommands: string[];
	disabledCategories: string[];
	mutedRoleId: string | null;
	level: Partial<Omit<Level, 'id'>>;
	welcome: Partial<Omit<Welcome, 'id'>>;
	leave: Partial<Omit<Leave, 'id'>>;
	ban: Partial<Omit<Ban, 'id'>>;
	log: Partial<Omit<Log, 'id'>>;
}
