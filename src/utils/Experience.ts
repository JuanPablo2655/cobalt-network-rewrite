import { CobaltClient } from '../struct/cobaltClient';

export default class Experience {
	cobalt: CobaltClient;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
	}

	async addXp(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { xp: user!.xp + amount, totalXp: user!.totalXp + amount });
		} catch (err) {
			console.error(err?.stack || err);
		}
	}

	async removeXp(userId: string, amount: number, levelUp: boolean) {
		try {
			if (isNaN(amount)) throw new TypeError('Xp must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			if (levelUp) await this.cobalt.db.updateUser(userId, { xp: user!.xp - amount });
			else await this.cobalt.db.updateUser(userId, { xp: user!.xp - amount, totalXp: user!.totalXp - amount });
		} catch (err) {
			console.error(err?.stack || err);
		}
	}

	async addLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { lvl: user!.lvl + amount });
		} catch (err) {
			console.error(err?.stack || err);
		}
	}

	async removeLevel(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Level must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { lvl: user!.lvl - amount });
		} catch (err) {
			console.error(err?.stack || err);
		}
	}

	nextLevel(level: number) {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}
}
