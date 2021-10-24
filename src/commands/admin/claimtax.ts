import { Message } from 'discord.js';
import { GenericCommand } from '../../structures/commands';
import { formatMoney } from '../../utils/util';

abstract class ClaimTaxCommand extends GenericCommand {
	constructor() {
		super({
			name: 'claimtax',
			description: 'Claim up to 1k of the tax fund.',
			category: 'admin',
			usage: '<amount>',
			cooldown: 60 * 60,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return message.channel.send({ content: 'An error has occured' });
		let isDirector = false;
		bot.directors?.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector) return message.channel.send({ content: 'not a director!' });
		const amount = Number(args[0]);
		if (!args[0]) return message.reply({ content: 'I need to update the tax rate, please input a number.' });
		if (isNaN(amount)) return message.reply({ content: 'Please I need a valid number' });
		if (bot.bank < amount)
			return message.reply({
				content: `I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
			});
		if (amount > 1000) return message.reply({ content: "Can't claim more than **₡1,000**" });
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
