import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { months } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { addMulti, formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class MonthlyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'monthly',
			description: 'Claim your monthly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { db, econ } = this.cobalt.container;
		const member = await resolveMember(args[0], message.guild!).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Member missing');
		const user = await db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + months(1);
		if (!isNaN(user.monthly!) && user.monthly! > date)
			throw new UserError(
				{ identifier: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(user.monthly! - Date.now())}** left before you can claim your monthly!`,
			);
		await addCD();
		if (member?.id === message.author.id) {
			const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
			await db.updateUser(message.author.id, { monthly: cooldown });
			await econ.addToWallet(member.id, monthlyAmount);
			return message.channel.send({
				content: `You have received your monthly **${formatMoney(monthlyAmount)}**.`,
			});
		}
		const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
		const moneyEarned = addMulti(monthlyAmount, 10);
		await db.updateUser(message.author.id, { monthly: cooldown });
		await econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send({
			content: `You gave your monthly of **${formatMoney(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default MonthlyCommand;
