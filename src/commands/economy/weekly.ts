import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import GenericCommand from '../../struct/GenericCommand';
import { addMulti, findMember, formatNumber } from '../../utils/util';

abstract class WeeklyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'weekly',
			description: 'Claim your weekly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		if (!member) return message.reply({ content: 'An error occured' });
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply({ content: 'An error occured' });
		const date = Date.now();
		const cooldown = date + 604800000;
		if (!isNaN(user.weekly!) && user.weekly! > date) {
			return message.reply({
				content: `You still have **${prettyMilliseconds(
					user.weekly! - Date.now(),
				)}** left before you can claim your weekly!`,
			});
		}
		await addCD();
		if (member?.id === message.author.id) {
			const weeklyAmount = Math.floor(750 + Math.random() * 250);
			await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
			await this.cobalt.econ.addToWallet(member.id, weeklyAmount);
			return message.channel.send({
				content: `You have received your weekly **₡${formatNumber(weeklyAmount)}**.`,
			});
		}
		const weeklyAmount = Math.floor(750 + Math.random() * 750);
		const moneyEarned = addMulti(weeklyAmount, 10);
		await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send({
			content: `You gave your weekly of **₡${formatNumber(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default WeeklyCommand;
