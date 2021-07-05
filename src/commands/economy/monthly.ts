import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import GenericCommand from '../../struct/GenericCommand';

abstract class MonthlyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'monthly',
			description: 'Claim your monthly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
		if (!member) return message.reply('An error occured');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply('An error occured');
		const date = Date.now();
		const cooldown = date + 2629800000;
		if (!isNaN(user.monthly) && user.monthly > date) {
			return message.reply(
				`You still have **${prettyMilliseconds(user.monthly - Date.now())}** left before you can claim your monthly!`,
			);
		}
		addCD();
		if (member?.id === message.author.id) {
			const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
			await this.cobalt.db.updateUser(message.author.id, { monthly: cooldown });
			await this.cobalt.econ.addToWallet(member.id, monthlyAmount);
			return message.channel.send(
				`You have received your monthly **₡${this.cobalt.utils.formatNumber(monthlyAmount)}**.`,
			);
		}
		const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
		const moneyEarned = this.cobalt.utils.addMulti(monthlyAmount, 10);
		await this.cobalt.db.updateUser(message.author.id, { monthly: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send(
			`You gave your monthly of **₡${this.cobalt.utils.formatNumber(moneyEarned)}** to **${member?.user.username}**.`,
		);
	}
}

export default MonthlyCommand;