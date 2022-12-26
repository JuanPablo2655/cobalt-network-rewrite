import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';
import { createUser, getUser } from '#lib/database';

abstract class WithdrawCommand extends GenericCommand {
	constructor() {
		super({
			name: 'withdraw',
			description: 'Withdraw money from your bank.',
			category: 'economy',
			usage: '[money]',
			aliases: ['with'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { econ } = this.cobalt.container;
		const profile = (await getUser(message.author.id)) ?? (await createUser(message.author.id));
		if (!profile) throw new Error('missing user database entry');
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'How much money');
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'all')
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
		await econ.removeFromBank(message.author.id, money);
		await econ.addToWallet(message.author.id, money);
		return message.channel.send({
			content: `You withdrew **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				profile.bank - money,
			)}**`,
		});
	}
}

export default WithdrawCommand;
