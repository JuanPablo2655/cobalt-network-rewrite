import { Message } from 'discord.js';
import GenericCommand from '../../structures/GenericCommand';
import { formatMoney } from '../../utils/util';

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

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const profile = await this.cobalt.db.getUser(message.author.id);
		if (!args[0]) return message.channel.send({ content: 'How much money' });
		let money = Number(args[0]);
		if (isNaN(money) && args[0] !== 'all') return message.channel.send({ content: 'Please input a valid number' });
		if (profile!.bank - money <= 0)
			return message.channel.send({ content: "You don't have that much money deposited" });
		if (args[0] === 'all') money = profile!.bank;
		if (money <= 0) return message.channel.send({ content: "You can't withdraw money you don't have" });
		await addCD();
		await this.cobalt.econ.removeFrombank(message.author.id, money);
		await this.cobalt.econ.addToWallet(message.author.id, money);
		return message.channel.send({
			content: `You withdrew **${formatMoney(money)}**. Your bank balance is now **${formatMoney(
				profile!.bank - money,
			)}**`,
		});
	}
}

export default WithdrawCommand;
