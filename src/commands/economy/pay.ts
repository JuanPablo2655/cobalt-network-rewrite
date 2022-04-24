import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember } from '#utils/util';
import { Identifiers, UserError } from '#lib/errors';
import { formatMoney } from '#utils/functions';

abstract class PayComamnd extends GenericCommand {
	constructor() {
		super({
			name: 'pay',
			description: 'Pay someone some of your money. There is a tax of **7.5%**.',
			category: 'economy',
			usage: '<user> <amount>',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) throw new Error('Missing bot database entry');
		const member = await findMember(this.cobalt, message, args);
		if (!member)
			throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Please pick a valid member');
		const author = await this.cobalt.db.getUser(message.author.id);
		if (!author) throw new Error('Missing author database entry');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		if (member.id === message.author.id)
			throw new UserError({ identifer: Identifiers.ArgumentUserError }, "You can't pay yourself");
		let amount = Number(args[1]);
		if (!args[1]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'You need to pay the user some money');
		if (args[1] === 'all') amount = author.wallet;
		else amount = Number(args[1]);
		if (isNaN(amount) && args[1] !== 'all')
			throw new UserError({ identifer: Identifiers.ArgumentIntegerError }, 'invalid number');
		if (author.wallet < amount)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerTooLarge },
				`You don't have enough to pay that much. You currently have **${formatMoney(author.wallet)}**`,
			);
		await addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await this.cobalt.econ.removeFromWallet(message.author.id, amount);
		await this.cobalt.econ.addToWallet(member.id, afterTax);
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { bank: bot.bank + tax });
		return message.channel.send({
			content: `>>> Transaction to **${member.user.username}**:\nSubtotal: **${formatMoney(
				amount,
			)}**\nTaxes: **${formatMoney(tax)}**\nTotal: **${formatMoney(afterTax)}**`,
		});
	}
}

export default PayComamnd;
