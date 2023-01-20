import type { Message } from 'discord.js';
import { updateUser, updateBot, getOrCreateUser, getOrCreateBot } from '#lib/database';
import { logger } from '#lib/structures';
import { container } from '#root/Container';
import { addMulti } from '#utils/functions';
import { calcMulti } from '#utils/util';

const { cobalt } = container;

/**
 * Add money to a users wallet
 *
 * @param id - The user Id
 * @param amount - Money to add
 */
export async function addToWallet(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { wallet: user.wallet + amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Remove money from a users wallet
 *
 * @param id - The user Id
 * @param amount - Money to remove
 */
export async function removeFromWallet(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { wallet: user.wallet - amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Transfer money to user bank account
 *
 * @param id - The user Id
 * @param amount - Money to transfer
 */
export async function addToBank(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bank: user.bank + amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Remove money from user bank account
 *
 * @param id - The user Id
 * @param amount - Money to remove
 */
export async function removeFromBank(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bank: user.bank - amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Add bank space to bank account
 *
 * @param id - The user Id
 * @param amount - Bank space to add
 */
export async function addBankSpace(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bankSpace: user.bankSpace + amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Remove bank space from bank account
 *
 * @param id - The user Id
 * @param amount - Bank space to remove
 */
export async function removeBankSpace(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bankSpace: user.bankSpace - amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Add a bounty to a user
 *
 * @param id - The user Id
 * @param amount - Bounty to add
 */
export async function addBounty(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bounty: user.bounty + amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Remove a bounty from a user
 *
 * @param id - The user Id
 * @param amount - Bounty to remove
 */
export async function removeBounty(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { bounty: user.bounty - amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Update the users job occupation
 *
 * @param id - The user Id
 * @param job - The job to set
 */
export async function updateJob(id: string, job: string | null) {
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, { job });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Kill a user and reset their stats
 *
 * @param id - The user Id
 */
export async function killUser(id: string) {
	try {
		const user = await getOrCreateUser(id);
		if (!user) throw new Error('Database error');
		return updateUser(id, {
			wallet: 0,
			bank: 0,
			bankSpace: 1_000,
			bounty: 0,
			job: null,
			deaths: user.deaths + 1,
		});
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Award a user bank space
 *
 * @param message - The message
 */
export async function awardBankSpace(message: Message) {
	const user = await getOrCreateUser(message.author.id);
	if (!user) throw new Error('Database error');
	const amount = Math.round(Math.random() * 11 + 15);
	const multi = await calcMulti(message.author, cobalt);
	const total = addMulti(amount, multi);
	await addBankSpace(message.author.id, total);
}

/**
 * Add to the bot bank account
 *
 * @param id - The bot Id
 * @param amount - Amount to add
 */
export async function addBotBank(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const bot = await getOrCreateBot(id);
		if (!bot) throw new Error('Database error');
		return updateBot(id, { bank: bot.bank + amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Remove from the bot bank account
 *
 * @param id - The bot Id
 * @param amount - Amount to remove
 */
export async function removeBotBank(id: string, amount: number) {
	if (Number.isNaN(amount)) throw new TypeError('Amount must be a number.');
	if (amount <= 0) throw new TypeError('Must be more than zero.');
	try {
		const bot = await getOrCreateBot(id);
		if (!bot) throw new Error('Database error');
		return updateBot(id, { bank: bot.bank - amount });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}

/**
 * Add to the tax rate
 *
 * @param id - The bot Id
 * @param tax - The tax rate
 */
export async function updateTax(id: string, tax: number) {
	if (Number.isNaN(tax)) throw new TypeError('Tax must be a number.');
	if (tax <= 0) throw new TypeError('Must be more than zero.');
	try {
		const bot = await getOrCreateBot(id);
		if (!bot) throw new Error('Database error');
		return updateBot(id, { tax });
	} catch (error_) {
		const error = error_ as Error;
		logger.error(error, error.message);
	}
}
