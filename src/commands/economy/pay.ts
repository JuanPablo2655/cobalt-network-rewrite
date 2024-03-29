import type { Message } from 'discord.js';
import { addToWallet, getOrCreateBot, getOrCreateUser, removeFromWallet, updateBot } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class PayCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'pay',
			description: 'Pay someone some of your money. There is a tax of **7.5%**.',
			category: 'economy',
			usage: '<user> <amount>',
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!this.cobalt.user) throw new Error('Missing user');
		const bot = await getOrCreateBot(this.cobalt.user.id);
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member)
			throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Please pick a valid member');
		const author = await getOrCreateUser(message.author.id);
		if (!author) throw new Error('Missing author database entry');
		const user = await getOrCreateUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		if (member.id === message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "You can't pay yourself");
		let amount = Number(args[1]);
		if (!args[1]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'You need to pay the user some money');
		if (args[1] === 'all') amount = author.wallet;
		else amount = Number(args[1]);
		if (Number.isNaN(amount) && args[1] !== 'all')
			throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'invalid number');
		if (author.wallet < amount)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				`You don't have enough to pay that much. You currently have **${formatMoney(author.wallet)}**`,
			);
		await addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await removeFromWallet(message.author.id, amount);
		await addToWallet(member.id, afterTax);
		await updateBot(this.cobalt.user.id, { bank: bot.bank + tax });
		return message.channel.send({
			content: `>>> Transaction to **${member.user.username}**:\nSubtotal: **${formatMoney(
				amount,
			)}**\nTaxes: **${formatMoney(tax)}**\nTotal: **${formatMoney(afterTax)}**`,
		});
	}
}

export default PayCommand;
