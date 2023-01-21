import type { Message } from 'discord.js';
import { addToBank, getOrCreateUser, removeFromWallet } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatMoney } from '#utils/functions';

abstract class DepositCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'deposit',
			description: 'Deposit money into your bank.',
			category: 'economy',
			usage: '[money]',
			aliases: ['dep'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const profile = await getOrCreateUser(message.author.id);
		if (!profile) throw new Error('Missing user database entry');
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'How much money?');
		let money = Number(args[0]);
		if (Number.isNaN(money) && args[0] !== 'max')
			throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Please input a valid number');
		if (profile.wallet - money <= 0)
			throw new UserError({ identifier: Identifiers.ArgumentIntegerTooSmall }, "You don't have that much money");
		if (profile.bank + money > profile.bankSpace)
			throw new UserError({ identifier: Identifiers.ArgumentIntegerTooLarge }, "You don't have that much bank space");
		if (args[0] === 'max') {
			const canDeposit = profile.bankSpace - profile.bank;
			if (canDeposit === 0)
				throw new UserError({ identifier: Identifiers.ArgumentIntegerTooSmall }, "You don't have bank space");
			money = Math.min(canDeposit, profile.wallet);
		}

		if (money < 0)
			throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, "You can't deposit negative money");
		await addCD();
		await removeFromWallet(message.author.id, money);
		await addToBank(message.author.id, money);
		return message.channel.send({
			content: `You deposited **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				profile.bank + money,
			)}**`,
		});
	}
}

export default DepositCommand;
