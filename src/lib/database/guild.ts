import { BanMessage, LeaveMessage, LevelMessage, LogChannel, WelcomeMessage } from '@prisma/client';
import { container } from '#root/Container';
import { logger } from '#lib/structures';
const { db } = container;

async function queryGuild(id: string) {
	try {
		const banMessage = await db.banMessage.findUniqueOrThrow({ where: { id: id } });
		const welcomeMessage = await db.welcomeMessage.findUniqueOrThrow({ where: { id: id } });
		const leaveMessage = await db.leaveMessage.findUniqueOrThrow({ where: { id: id } });
		const levelMessage = await db.levelMessage.findUniqueOrThrow({ where: { id: id } });
		const logChannel = await db.logChannel.findUniqueOrThrow({ where: { id: id } });
		return { banMessage, welcomeMessage, leaveMessage, levelMessage, logChannel };
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
				levelMessage: {
					create: {
						message: data?.levelMessage?.message,
						enabled: data?.levelMessage?.enabled,
					},
				},
				welcomeMessage: {
					create: {
						message: data?.welcomeMessage?.message,
						channelId: data?.welcomeMessage?.channelId,
						enabled: data?.welcomeMessage?.enabled,
					},
				},
				leaveMessage: {
					create: {
						message: data?.leaveMessage?.message,
						channelId: data?.leaveMessage?.channelId,
						enabled: data?.leaveMessage?.enabled,
					},
				},
				banMessage: {
					create: {
						message: data?.banMessage?.message,
						enabled: data?.banMessage?.enabled,
					},
				},
				logChannel: {
					create: {
						channelId: data?.logChannel?.channelId,
						enabled: data?.logChannel?.enabled,
						disabledEvents: data?.logChannel?.disabledEvents,
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
				levelMessage: {
					update: {
						message: data?.levelMessage?.message,
						enabled: data?.levelMessage?.enabled,
					},
				},
				welcomeMessage: {
					update: {
						message: data?.welcomeMessage?.message,
						channelId: data?.welcomeMessage?.channelId,
						enabled: data?.welcomeMessage?.enabled,
					},
				},
				leaveMessage: {
					update: {
						message: data?.leaveMessage?.message,
						channelId: data?.leaveMessage?.channelId,
						enabled: data?.leaveMessage?.enabled,
					},
				},
				banMessage: {
					update: {
						message: data?.banMessage?.message,
						enabled: data?.banMessage?.enabled,
					},
				},
				logChannel: {
					update: {
						channelId: data?.logChannel?.channelId,
						enabled: data?.logChannel?.enabled,
						disabledEvents: data?.logChannel?.disabledEvents,
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
	levelMessage: Partial<Omit<LevelMessage, 'id'>>;
	welcomeMessage: Partial<Omit<WelcomeMessage, 'id'>>;
	leaveMessage: Partial<Omit<LeaveMessage, 'id'>>;
	banMessage: Partial<Omit<BanMessage, 'id'>>;
	logChannel: Partial<Omit<LogChannel, 'id'>>;
}
