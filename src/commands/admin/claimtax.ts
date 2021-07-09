import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return message.channel.send({ content: 'An error has occured' });
		let isDirector = false;
		bot.directors.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector) return message.channel.send({ content: 'not a director!' });
		const amount = Number(args[0]);
		if (!args[0]) return message.reply('I need to update the tax rate, please input a number.');
		if (isNaN(amount)) return message.reply('Please I need a valid number');
		if (bot.bank < amount)
			return message.reply(`I don't have that much. I have **${this.cobalt.utils.formatNumber(bot.bank)}** left.`);
		if (amount > 1000) return message.reply("Can't claim more than **₡1,000**");
		addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { bank: bot.bank - amount });
		await this.cobalt.econ.addToWallet('232670598872956929', tax);
		await this.cobalt.econ.addToWallet(message.author.id, afterTax);
		return message.channel.send({
			content: `You have claimed **₡${this.cobalt.utils.formatNumber(
				afterTax,
			)}** after paying Axalis **₡${this.cobalt.utils.formatNumber(tax)}** as tax.`,
		});
	}
}

export default ClaimTaxCommand;
