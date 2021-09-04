import { Message } from 'discord.js';
import { CobaltClient } from '../struct/cobaltClient';
import { addMulti, calcMulti } from './util';

export default class Currency {
	cobalt: CobaltClient;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
	}

	async addToWallet(userId: string, money: number) {
		try {
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { wallet: user!.wallet + money, netWorth: user!.netWorth + money });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeFromWallet(userId: string, money: number) {
		try {
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { wallet: user!.wallet - money, netWorth: user!.netWorth - money });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addToBank(userId: string, money: number) {
		try {
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bank: user!.bank + money, netWorth: user!.netWorth + money });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeFrombank(userId: string, money: number) {
		try {
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bank: user!.bank - money, netWorth: user!.netWorth - money });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addBankSpace(userId: string, space: number) {
		try {
			if (isNaN(space)) throw new TypeError('Money must be a number.');
			if (space <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bankSpace: user!.bankSpace + space });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeBankSpace(userId: string, space: number) {
		try {
			if (isNaN(space)) throw new TypeError('Money must be a number.');
			if (space <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bankSpace: user!.bankSpace - space });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addBounty(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bounty: user!.bounty + amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeBounty(userId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { bounty: user!.bounty - amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateJob(userId: string, job: string | null) {
		try {
			if (!job && job !== null) throw new TypeError('Must supply a job id');
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, { job });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async killUser(userId: string) {
		try {
			let user = await this.cobalt.db.getUser(userId);

			if (!user) user = await this.cobalt.db.addUser(userId);

			await this.cobalt.db.updateUser(userId, {
				wallet: 0,
				bank: 0,
				bankSpace: 1000,
				bounty: 0,
				job: null,
				deaths: user!.deaths + 1,
			});
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async manageBankSpace(message: Message) {
		try {
			const multi = await calcMulti(message.author, this.cobalt);
			const bankSpaceToAdd = Math.round(Math.random() * 11 + 15);
			const addMulit = addMulti(bankSpaceToAdd, multi);
			await this.addBankSpace(message.author.id, addMulit);
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addBotBank(botId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let bot = await this.cobalt.db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await this.cobalt.db.updateBot(botId, { bank: bot.bank + amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removebotBank(botId: string, amount: number) {
		try {
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			let bot = await this.cobalt.db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await this.cobalt.db.updateBot(botId, { bank: bot.bank - amount });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateTax(botId: string, tax: number) {
		try {
			if (isNaN(tax)) throw new TypeError('Money must be a number.');
			if (tax <= 0) throw new TypeError('Must be more than zero.');
			let bot = await this.cobalt.db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await this.cobalt.db.updateBot(botId, { tax });
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}
}
