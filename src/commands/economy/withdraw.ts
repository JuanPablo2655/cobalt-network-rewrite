import type { Message } from 'discord.js';
import { addToWallet, getOrCreateUser, removeFromBank } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatMoney } from '#utils/functions';

abstract class WithdrawCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'withdraw',
			description: 'Withdraw money from your bank.',
			category: 'economy',
			usage: '[money]',
			aliases: ['with'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const profile = await getOrCreateUser(message.author.id);
		if (!profile) throw new Error('missing user database entry');
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'How much money');
		let money = Number(args[0]);
		if (Number.isNaN(money) && args[0] !== 'all')
			throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		if (profile.bank - money <= 0)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				"You don't have that much money deposited",
			);
		if (args[0] === 'all') money = profile.bank;
		if (money <= 0)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				"You can't withdraw money you don't have",
			);
		await addCD();
		await removeFromBank(message.author.id, money);
		await addToWallet(message.author.id, money);
		return message.channel.send({
			content: `You withdrew **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				profile.bank - money,
			)}**`,
		});
	}
}

export default WithdrawCommand;
