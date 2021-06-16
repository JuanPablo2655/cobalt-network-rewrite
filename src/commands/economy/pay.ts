import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class PayComamnd extends GenericCommand {
	constructor() {
		super({
			name: 'pay',
			description: 'Pay someone some of your money. There is a tax of **7.5%**.',
			category: 'economy',
			usage: '<user> <amount>',
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return message.reply('An error occured');
		const member = await this.cobalt.utils.findMember(message, args);
		if (!member) return message.reply('Please pick a valid member');
		const author = await this.cobalt.db.getUser(message.author.id);
		if (!author) return message.reply('An error occured');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply('An error occured');
		if (member.id === message.author.id) return message.reply("You can't pay yourself!");
		let amount = Number(args[1]);
		if (!args[1]) return message.reply('You need to pay the user some money.');
		if (args[1] === 'all') amount = author.wallet;
		else amount = Number(args[1]);
		if (isNaN(amount) && args[1] !== 'all') return message.reply('Amount must be a number.');
		if (author.wallet < amount)
			return message.channel.send(
				`You don't have enough to pay that much. You currently have **₡${this.cobalt.utils.formatNumber(
					author.wallet,
				)}**`,
			);
		addCD();
		const tax = Math.round(amount * (bot.tax / 100));
		const afterTax = amount - tax;
		await this.cobalt.econ.removeFromWallet(message.author.id, amount);
		await this.cobalt.econ.addToWallet(member.id, afterTax);
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { bank: bot.bank + tax });
		return message.channel.send(
			`>>> Transaction to **${member.user.username}**:\nSubtotal: **₡${this.cobalt.utils.formatNumber(
				amount,
			)}**\nTaxes: **₡${this.cobalt.utils.formatNumber(tax)}**\nTotal: **₡${this.cobalt.utils.formatNumber(
				afterTax,
			)}**`,
		);
	}
}

export default PayComamnd;
