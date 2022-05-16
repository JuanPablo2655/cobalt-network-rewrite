import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';

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
		const profile = await this.cobalt.db.getUser(message.author.id);
		if (!profile) throw new Error('missing user database entry');
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'How much money');
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'all')
			throw new UserError({ identifer: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		if (profile.bank - money <= 0)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerTooLarge },
				"You don't have that much money deposited",
			);
		if (args[0] === 'all') money = profile.bank;
		if (money <= 0)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerTooLarge },
				"You can't withdraw money you don't have",
			);
		await addCD();
		await this.cobalt.econ.removeFrombank(message.author.id, money);
		await this.cobalt.econ.addToWallet(message.author.id, money);
		return message.channel.send({
			content: `You withdrew **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				profile.bank - money,
			)}**`,
		});
	}
}

export default WithdrawCommand;
