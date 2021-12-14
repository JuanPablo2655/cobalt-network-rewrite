import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { formatMoney } from '#utils/util';
import { Default } from '#lib/typings';

abstract class DepositCommand extends GenericCommand {
	constructor() {
		super({
			name: 'deposit',
			description: 'Deposit money into your bank.',
			category: 'economy',
			usage: '[money]',
			aliases: ['dep'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const profile = await this.cobalt.db.getUser(message.author.id);
		if (!args[0]) return message.channel.send({ content: 'How much money?' });
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'max') return message.channel.send({ content: 'Please input a valid number' });
		if ((profile?.wallet ?? Default.Wallet) - money <= 0)
			return message.channel.send({ content: "You don't have that much money" });
		if ((profile?.bank ?? Default.Bank) + money > (profile?.bankSpace ?? Default.BankSpace))
			return message.channel.send({ content: "You don't have that much bank space" });
		if (args[0] == 'max') {
			const canDeposit = (profile?.bankSpace ?? Default.BankSpace) - (profile?.bank ?? Default.Bank);
			if (canDeposit === 0) return message.channel.send({ content: "You don't have bank space" });
			money = Math.min(canDeposit, profile?.wallet ?? Default.Wallet);
		}
		if (money < 0) return message.channel.send({ content: "You can't deposit negative money" });
		await addCD();
		await this.cobalt.econ.removeFromWallet(message.author.id, money);
		await this.cobalt.econ.addToBank(message.author.id, money);
		return message.channel.send({
			content: `You deposited **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				(profile?.bank ?? Default.Bank) + money,
			)}**`,
		});
	}
}

export default DepositCommand;
