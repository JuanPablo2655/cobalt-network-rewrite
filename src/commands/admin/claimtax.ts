import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { formatMoney } from '#utils/functions';
import { hours } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { addToWallet, getOrCreateBot, updateBot } from '#lib/database';

abstract class ClaimTaxCommand extends GenericCommand {
	constructor() {
		super({
			name: 'claimtax',
			description: 'Claim up to 1k of the tax fund.',
			category: 'admin',
			usage: '<amount>',
			cooldown: hours(1),
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!this.cobalt.user) throw new Error('Missing user');
		const bot = await getOrCreateBot(this.cobalt.user.id);
		if (!bot) throw new Error('Missing user bot');
		let isDirector = false;
		bot.directors?.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector) throw new UserError({ identifier: Identifiers.PreconditionUserPermissions }, 'Not a director');
		const amount = Number(args[0]);
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing integer');
		if (isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		if (bot.bank < amount)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerError },
				`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
			);
		if (amount > 1000)
			throw new UserError({ identifier: Identifiers.ArgumentNumberTooLarge }, "Can't claim more than **₡1,000**");
		await addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await updateBot(this.cobalt.user.id, { bank: bot.bank - amount });
		await addToWallet('232670598872956929', tax);
		await addToWallet(message.author.id, afterTax);
		return message.channel.send({
			content: `You have claimed **${formatMoney(afterTax)}** after paying Axalis **${formatMoney(tax)}** as tax.`,
		});
	}
}

export default ClaimTaxCommand;
