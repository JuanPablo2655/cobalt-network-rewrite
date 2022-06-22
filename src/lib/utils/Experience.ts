import { logger } from '#lib/structures';
import { Default } from '#lib/typings';
import { Message, Snowflake } from 'discord.js';
import { CobaltClient } from '../CobaltClient';

export default class Experience {
	cobalt: CobaltClient;
	public cooldowns: Set<Snowflake>;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
		this.cooldowns = new Set();
	}

	/**
	 * Add xp to the user
	 * @param userId The user Id
	 * @param amount Amount of xp to add
	 */
	async addXp(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.container.db.getUser(userId)) ?? (await this.cobalt.container.db.addUser(userId));

			await this.cobalt.container.db.updateUser(userId, {
				xp: (user?.xp ?? Default.Xp) + amount,
				totalXp: (user?.totalXp ?? 0) + amount,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove xp from the user
	 * @param userId The user Id
	 * @param amount Amount of xp to remove
	 * @param levelUp If levelUp is true then don't remove from totalXp
	 */
	async removeXp(userId: string, amount: number, levelUp: boolean) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.container.db.getUser(userId)) ?? (await this.cobalt.container.db.addUser(userId));

			if (levelUp) await this.cobalt.container.db.updateUser(userId, { xp: (user?.xp ?? Default.Xp) - amount });
			else
				await this.cobalt.container.db.updateUser(userId, {
					xp: (user?.xp ?? Default.Xp) - amount,
					totalXp: (user?.totalXp ?? 0) - amount,
				});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add levels the user
	 * @param userId The user Id
	 * @param amount Amount of levels to add
	 */
	async addLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.container.db.getUser(userId)) ?? (await this.cobalt.container.db.addUser(userId));

			await this.cobalt.container.db.updateUser(userId, { lvl: (user?.lvl ?? Default.Level) + amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove levels from the user
	 * @param userId The user Id
	 * @param amount Amount of levels to remove
	 */
	async removeLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.container.db.getUser(userId)) ?? (await this.cobalt.container.db.addUser(userId));

			await this.cobalt.container.db.updateUser(userId, { lvl: (user?.lvl ?? Default.Level) - amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Check how much xp the user needs to level up
	 * @param level The amount of levels the user has
	 */
	nextLevel(level: number) {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	/**
	 * Manage the users xp
	 * @param message The message
	 * @returns If the use has leveled up or not
	 */
	async manageXp(message: Message) {
		try {
			const user = await this.cobalt.container.db.getUser(message.author.id);
			const xpToAdd = Math.round(Math.random() * 11 + 15);
			const nextLevel = this.nextLevel(user?.lvl ?? Default.Xp);
			const newXp = (user?.xp ?? Default.Xp) + xpToAdd;
			if (newXp > nextLevel) {
				await this.addLevel(message.author.id, 1);
				await this.addXp(message.author.id, xpToAdd);
				await this.removeXp(message.author.id, nextLevel, true);
				return true;
			}
			await this.addXp(message.author.id, xpToAdd);
			return false;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}
}
