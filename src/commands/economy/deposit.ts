import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const profile = await this.cobalt.db.getUser(message.author.id);
		if (!args[0]) return message.channel.send('How much money?');
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'max') return message.channel.send('Please input a valid number');
		if (profile!.wallet - money <= 0) return message.channel.send("You don't have that much money");
		if (profile!.bank + money > profile!.bankSpace) return message.channel.send("You don't have that much bank space");
		if (args[0] == 'max') {
			const canDeposit = profile!.bankSpace - profile!.bank;
			if (canDeposit === 0) return message.channel.send("You don't have bank space");
			money = Math.min(canDeposit, profile!.wallet);
		}
		if (money < 0) return message.channel.send("You can't deposit negative money");
		addCD();
		await this.cobalt.econ.removeFromWallet(message.author.id, money);
		await this.cobalt.econ.addToBank(message.author.id, money);
		return message.channel.send(
			`You deposited **₡${this.cobalt.utils.formatNumber(
				money,
			)}**. Your bank balance is now **₡${this.cobalt.utils.formatNumber(profile!.bank + money)}**`,
		);
	}
}

export default DepositCommand;