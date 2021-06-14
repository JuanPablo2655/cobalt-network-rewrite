import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import GenericCommand from '../../struct/GenericCommand';

abstract class WeeklyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'weekly',
			description: 'Claim your weekly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
		if (!member) return message.reply('An error occured');
        const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply('An error occured');
        const date = Date.now();
		const cooldown = date + 604800000;
        if (!isNaN(user.weekly) && user.weekly > date) {
			return message.reply(
				`You still have **${prettyMilliseconds(
					user.weekly - Date.now(),
				)}** left before you can claim your weekly!`,
			);
		}
		addCD();
		if (member?.id === message.author.id) {
			const weeklyAmount = Math.floor(750 + Math.random() * 250);
            await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
			await this.cobalt.econ.addToWallet(member.id, weeklyAmount);
			return message.channel.send(`You have received your weekly **₡${this.cobalt.utils.formatNumber(weeklyAmount)}**.`);
		}
		const weeklyAmount = Math.floor(750 + Math.random() * 750);
		const moneyEarned = this.cobalt.utils.addMulti(weeklyAmount, 10);
        await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send(
			`You gave your weekly of **₡${this.cobalt.utils.formatNumber(moneyEarned)}** to **${member?.user.username}**.`,
		);
	}
}

export default WeeklyCommand;
