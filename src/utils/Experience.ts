import { Message, Snowflake } from 'discord.js';
import { CobaltClient } from '../struct/cobaltClient';

export default class Experience {
	cobalt: CobaltClient;
	public cooldowns: Set<Snowflake>;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
		this.cooldowns = new Set();
	}

	async addXp(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.db.getUser(userId)) ?? (await this.cobalt.db.addUser(userId));

			await this.cobalt.db.updateUser(userId, { xp: user!.xp + amount, totalXp: user!.totalXp + amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeXp(userId: string, amount: number, levelUp: boolean) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.db.getUser(userId)) ?? (await this.cobalt.db.addUser(userId));

			if (levelUp) await this.cobalt.db.updateUser(userId, { xp: user!.xp - amount });
			else await this.cobalt.db.updateUser(userId, { xp: user!.xp - amount, totalXp: user!.totalXp - amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.db.getUser(userId)) ?? (await this.cobalt.db.addUser(userId));

			await this.cobalt.db.updateUser(userId, { lvl: user!.lvl + amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await this.cobalt.db.getUser(userId)) ?? (await this.cobalt.db.addUser(userId));

			await this.cobalt.db.updateUser(userId, { lvl: user!.lvl - amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	nextLevel(level: number) {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	async manageXp(message: Message) {
		try {
			const user = await this.cobalt.db.getUser(message.author.id);
			const xpToAdd = Math.round(Math.random() * 11 + 15);
			const nextLevel = this.nextLevel(user!.lvl);
			const newXp = user!.xp + xpToAdd;
			if (newXp > nextLevel) {
				await this.addLevel(message.author.id, 1);
				await this.addXp(message.author.id, xpToAdd);
				await this.removeXp(message.author.id, nextLevel, true);
				return true;
			}
			await this.addXp(message.author.id, xpToAdd);
			return false;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}
}
