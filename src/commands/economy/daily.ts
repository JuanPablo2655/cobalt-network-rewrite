import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { addMulti, findMember } from '#utils/util';
import { days } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { formatMoney } from '#utils/functions';

abstract class DailyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'daily',
			description: 'Claim your daily reward',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { db, econ } = this.cobalt.container;
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = await db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + days(1);
		if (!isNaN(user.daily!) && user.daily! > date)
			throw new UserError(
				{ identifer: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(user.daily! - Date.now())}** left before you can claim your daily!`,
			);
		await addCD();
		if (member.id === message.author.id) {
			const dailyAmount = Math.floor(250 + Math.random() * 150);
			await db.updateUser(message.author.id, { daily: cooldown });
			await econ.addToWallet(member.id, dailyAmount);
			return message.channel.send({
				content: `You have received your daily **${formatMoney(dailyAmount)}**.`,
			});
		}
		const dailyAmount = Math.floor(250 + Math.random() * 150);
		const moneyEarned = addMulti(dailyAmount, 10);
		await db.updateUser(message.author.id, { daily: cooldown });
		await econ.addToWallet(member.id, moneyEarned);
		return message.channel.send({
			content: `You gave your daily of **${formatMoney(moneyEarned)}** to **${member.user.username}**.`,
		});
	}
}

export default DailyCommand;
