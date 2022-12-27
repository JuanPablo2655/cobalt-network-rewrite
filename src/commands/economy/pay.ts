import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';
import { createBot, createUser, getBot, getUser, updateBot } from '#lib/database';

abstract class PayCommand extends GenericCommand {
	constructor() {
		super({
			name: 'pay',
			description: 'Pay someone some of your money. There is a tax of **7.5%**.',
			category: 'economy',
			usage: '<user> <amount>',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { econ } = this.cobalt.container;
		if (!this.cobalt.user) throw new Error('Missing user');
		const bot = (await getBot(this.cobalt.user.id)) ?? (await createBot(this.cobalt.user.id));
		if (!bot) throw new Error('Missing bot database entry');
		const member = await resolveMember(args[0], message.guild!).catch(() => message.member);
		if (!member)
			throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Please pick a valid member');
		const author = (await getUser(message.author.id)) ?? (await createUser(message.author.id));
		if (!author) throw new Error('Missing author database entry');
		const user = (await getUser(member.id)) ?? (await createUser(member.id));
		if (!user) throw new Error('Missing user database entry');
		if (member.id === message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "You can't pay yourself");
		let amount = Number(args[1]);
		if (!args[1]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'You need to pay the user some money');
		if (args[1] === 'all') amount = author.wallet;
		else amount = Number(args[1]);
		if (isNaN(amount) && args[1] !== 'all')
			throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'invalid number');
		if (author.wallet < amount)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				`You don't have enough to pay that much. You currently have **${formatMoney(author.wallet)}**`,
			);
		await addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await econ.removeFromWallet(message.author.id, amount);
		await econ.addToWallet(member.id, afterTax);
		await updateBot(this.cobalt.user.id, { bank: bot.bank + tax });
		return message.channel.send({
			content: `>>> Transaction to **${member.user.username}**:\nSubtotal: **${formatMoney(
				amount,
			)}**\nTaxes: **${formatMoney(tax)}**\nTotal: **${formatMoney(afterTax)}**`,
		});
	}
}

export default PayCommand;
