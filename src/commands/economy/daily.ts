import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { addMulti, findMember, formatMoney } from '#utils/util';

abstract class DailyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'daily',
			description: 'Claim your daily reward',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		if (!member) return message.reply({ content: 'An error occured' });
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply({ content: 'An error occured' });
		const date = Date.now();
		const cooldown = date + 86400000;
		if (!isNaN(user.daily!) && user.daily! > date) {
			return message.reply({
				content: `You still have **${prettyMilliseconds(
					user.daily! - Date.now(),
				)}** left before you can claim your daily!`,
			});
		}
		await addCD();
		if (member?.id === message.author.id) {
			const dailyAmount = Math.floor(250 + Math.random() * 150);
			await this.cobalt.db.updateUser(message.author.id, { daily: cooldown });
			await this.cobalt.econ.addToWallet(member.id, dailyAmount);
			return message.channel.send({
				content: `You have received your daily **${formatMoney(dailyAmount)}**.`,
			});
		}
		const dailyAmount = Math.floor(250 + Math.random() * 150);
		const moneyEarned = addMulti(dailyAmount, 10);
		await this.cobalt.db.updateUser(message.author.id, { daily: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send({
			content: `You gave your daily of **${formatMoney(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default DailyCommand;
