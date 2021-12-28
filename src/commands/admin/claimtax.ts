import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { formatMoney } from '#utils/util';
import { hours } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

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
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) throw new Error('Missing user bot');
		let isDirector = false;
		bot.directors?.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector) throw new UserError({ identifer: Identifiers.PreconditionUserPermissions }, 'Not a director');
		const amount = Number(args[0]);
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing integer');
		if (isNaN(amount)) throw new UserError({ identifer: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		if (bot.bank < amount)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerError },
				`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
			);
		if (amount > 1000)
			throw new UserError({ identifer: Identifiers.ArgumentNumberTooLarge }, "Can't claim more than **₡1,000**");
		await addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { bank: bot.bank - amount });
		await this.cobalt.econ.addToWallet('232670598872956929', tax);
		await this.cobalt.econ.addToWallet(message.author.id, afterTax);
		return message.channel.send({
			content: `You have claimed **${formatMoney(afterTax)}** after paying Axalis **${formatMoney(tax)}** as tax.`,
		});
	}
}

export default ClaimTaxCommand;
