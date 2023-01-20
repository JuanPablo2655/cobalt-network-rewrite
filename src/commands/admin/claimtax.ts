import type { Message } from 'discord.js';
import { addToWallet, getOrCreateBot, updateBot } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { hours } from '#utils/common';
import { formatMoney } from '#utils/functions';

abstract class ClaimTaxCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'claimtax',
			description: 'Claim up to 1k of the tax fund.',
			category: 'admin',
			usage: '<amount>',
			cooldown: hours(1),
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!this.cobalt.user) throw new Error('Missing user');
		const bot = await getOrCreateBot(this.cobalt.user.id);
		if (!bot) throw new Error('Missing user bot');
		let isDirector = false;
		if (bot.directors)
			for (const director of bot.directors) {
				if (director === message.author.id) {
					isDirector = true;
				}
			}

		if (!isDirector) throw new UserError({ identifier: Identifiers.PreconditionUserPermissions }, 'Not a director');
		const amount = Number(args[0]);
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing integer');
		if (Number.isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		if (bot.bank < amount)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerError },
				`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
			);
		if (amount > 1_000)
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
