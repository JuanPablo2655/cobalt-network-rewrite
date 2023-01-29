import type { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { addToWallet, getOrCreateUser, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { months } from '#utils/common';
import { addMulti, formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class MonthlyCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'monthly',
			description: 'Claim your monthly reward.',
			category: 'economy',
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Member missing');
		const user = await getOrCreateUser(member.id);
		const date = Date.now();
		const cooldown = date + months(1);
		if (user.monthly.getTime() > date)
			throw new UserError(
				{ identifier: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(
					user.monthly.getTime() - Date.now(),
				)}** left before you can claim your monthly!`,
			);
		await addCD();
		if (member.id === message.author.id) {
			const monthlyAmount = Math.floor(3_500 + Math.random() * 1_500);
			await updateUser(message.author.id, { monthly: new Date(cooldown) });
			await addToWallet(member.id, monthlyAmount);
			return message.channel.send({
				content: `You have received your monthly **${formatMoney(monthlyAmount)}**.`,
			});
		}

		const monthlyAmount = Math.floor(3_500 + Math.random() * 1_500);
		const moneyEarned = addMulti(monthlyAmount, 10);
		await updateUser(message.author.id, { monthly: new Date(cooldown) });
		await addToWallet(member.id, moneyEarned);
		return message.channel.send({
			content: `You gave your monthly of **${formatMoney(moneyEarned)}** to **${member.user.username}**.`,
		});
	}
}

export default MonthlyCommand;
