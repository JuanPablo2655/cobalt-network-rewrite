import { logger } from '#lib/structures';
import { Default } from '#lib/typings';
import { Message } from 'discord.js';
import { CobaltClient } from '../CobaltClient.js';
import { addMulti, calcMulti } from '#utils/util';

export default class Currency {
	cobalt: CobaltClient;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
	}

	/**
	 * Add money to a users wallet
	 * @param userId The user Id
	 * @param money Money to add
	 */
	async addToWallet(userId: string, money: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, {
				wallet: (user?.wallet ?? Default.Wallet) + money,
				netWorth: (user?.netWorth ?? 0) + money,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove money from a users wallet
	 * @param userId The user Id
	 * @param money Money to remove
	 */
	async removeFromWallet(userId: string, money: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, {
				wallet: (user?.wallet ?? Default.Wallet) - money,
				netWorth: (user?.netWorth ?? 0) - money,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Transfer money to user bank account
	 * @param userId The user Id
	 * @param money Money to add in bank account
	 */
	async addToBank(userId: string, money: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, {
				bank: (user?.bank ?? Default.Bank) + money,
				netWorth: (user?.netWorth ?? 0) + money,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Withdraw money from user bank account
	 * @param userId The user Id
	 * @param money Money to remove from bank account
	 */
	async removeFrombank(userId: string, money: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(money)) throw new TypeError('Money must be a number.');
			if (money <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, {
				bank: (user?.bank ?? Default.Bank) - money,
				netWorth: (user?.netWorth ?? 0) - money,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add bank space to bank account
	 * @param userId The user Id
	 * @param space Space to add in bank account
	 */
	async addBankSpace(userId: string, space: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(space)) throw new TypeError('Money must be a number.');
			if (space <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, { bankSpace: (user?.bankSpace ?? Default.BankSpace) + space });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove bank space from bank account
	 * @param userId The user Id
	 * @param space Space to remove from bank account
	 */
	async removeBankSpace(userId: string, space: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(space)) throw new TypeError('Money must be a number.');
			if (space <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, { bankSpace: (user?.bankSpace ?? Default.BankSpace) - space });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add a bounty to a user
	 * @param userId The user Id
	 * @param amount Amount of bounty to add
	 */
	async addBounty(userId: string, amount: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, { bounty: (user?.bounty ?? 0) + amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove bounty from a user
	 * @param userId The user Id
	 * @param amount Amount of bounty to remove
	 */
	async removeBounty(userId: string, amount: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, { bounty: (user?.bounty ?? 0) - amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update the users job occupation
	 * @param userId The user Id
	 * @param job the job Id
	 */
	async updateJob(userId: string, job: string | null) {
		try {
			const { db } = this.cobalt.container;
			if (!job && job !== null) throw new TypeError('Must supply a job id');
			(await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, { job });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Kill a user
	 * @param userId The user Id
	 */
	async killUser(userId: string) {
		try {
			const { db } = this.cobalt.container;
			const user = (await db.getUser(userId)) ?? (await db.addUser(userId));

			await db.updateUser(userId, {
				wallet: 0,
				bank: 0,
				bankSpace: 1000,
				bounty: 0,
				job: null,
				deaths: (user?.deaths ?? 0) + 1,
			});
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add bank space to user bank account based on their muiltiplyer
	 * @param message The message
	 */
	async manageBankSpace(message: Message) {
		try {
			const multi = await calcMulti(message.author, this.cobalt);
			const bankSpaceToAdd = Math.round(Math.random() * 11 + 15);
			const addMulit = addMulti(bankSpaceToAdd, multi);
			await this.addBankSpace(message.author.id, addMulit);
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add money to bots bank account
	 * @param botId The bot Id
	 * @param amount Amount to add
	 */
	async addBotBank(botId: string, amount: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const bot = await db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await db.updateBot(botId, { bank: bot.bank + amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove money from the bots bank account
	 * @param botId The bot Id
	 * @param amount Amount to remove
	 */
	async removebotBank(botId: string, amount: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(amount)) throw new TypeError('Money must be a number.');
			if (amount <= 0) throw new TypeError('Must be more than zero.');
			const bot = await db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await db.updateBot(botId, { bank: bot.bank - amount });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update the tax rate globally
	 * @param botId The bot Id
	 * @param tax The updated tax
	 */
	async updateTax(botId: string, tax: number) {
		try {
			const { db } = this.cobalt.container;
			if (isNaN(tax)) throw new TypeError('Money must be a number.');
			if (tax <= 0) throw new TypeError('Must be more than zero.');
			const bot = await db.getBot(botId);

			if (!bot) throw new Error('Bot not found');

			await db.updateBot(botId, { tax });
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}
}
