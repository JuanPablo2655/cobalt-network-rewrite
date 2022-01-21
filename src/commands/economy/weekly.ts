import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { addMulti, findMember, formatMoney } from '#utils/util';
import { days } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

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
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Member missing');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + days(7);
		if (!isNaN(user.weekly!) && user.weekly! > date)
			throw new UserError(
				{ identifer: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(user.weekly! - Date.now())}** left before you can claim your weekly!`,
			);
		await addCD();
		if (member?.id === message.author.id) {
			const weeklyAmount = Math.floor(750 + Math.random() * 250);
			await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
			await this.cobalt.econ.addToWallet(member.id, weeklyAmount);
			return message.channel.send({
				content: `You have received your weekly **${formatMoney(weeklyAmount)}**.`,
			});
		}
		const weeklyAmount = Math.floor(750 + Math.random() * 750);
		const moneyEarned = addMulti(weeklyAmount, 10);
		await this.cobalt.db.updateUser(message.author.id, { weekly: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send({
			content: `You gave your weekly of **${formatMoney(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default WeeklyCommand;
