import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class WithdrawCommand extends GenericCommand {
	constructor() {
		super({
			name: 'withdraw',
			description: 'Withdraw money from your bank.',
			category: 'economy',
			usage: '[money]',
			aliases: ['with'],
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const profile = await this.cobalt.db.getUser(message.author.id);
		if (!args[0]) return message.channel.send('How much money');
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'all') return message.channel.send('Please input a valid number');
		if (profile!.bank - money <= 0) return message.channel.send("You don't have that much money deposited");
		if (args[0] === 'all') money = profile!.bank;
		if (money <= 0) return message.channel.send("You can't withdraw money you don't have");
		addCD();
		await this.cobalt.econ.removeFrombank(message.author.id, money);
		await this.cobalt.econ.addToWallet(message.author.id, money);
		return message.channel.send(
			`You withdrew **₡${this.cobalt.utils.formatNumber(
				money,
			)}**. Your bank balance is now **₡${this.cobalt.utils.formatNumber(profile!.bank - money)}**`,
		);
	}
}

export default WithdrawCommand;
