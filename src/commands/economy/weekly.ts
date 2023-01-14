import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { days } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { addMulti, formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';
import { addToWallet, getOrCreateUser, updateUser } from '#lib/database';

abstract class WeeklyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'weekly',
			description: 'Claim your weekly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Member missing');
		const user = await getOrCreateUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + days(7);
		if (user.weekly.getTime() > date)
			throw new UserError(
				{ identifier: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(
					user.weekly.getTime() - Date.now(),
				)}** left before you can claim your weekly!`,
			);
		await addCD();
		if (member?.id === message.author.id) {
			const weeklyAmount = Math.floor(750 + Math.random() * 250);
			await updateUser(message.author.id, { weekly: new Date(cooldown) });
			await addToWallet(member.id, weeklyAmount);
			return message.channel.send({
				content: `You have received your weekly **${formatMoney(weeklyAmount)}**.`,
			});
		}
		const weeklyAmount = Math.floor(750 + Math.random() * 750);
		const moneyEarned = addMulti(weeklyAmount, 10);
		await updateUser(message.author.id, { weekly: new Date(cooldown) });
		await addToWallet(member.id, moneyEarned);
		return message.channel.send({
			content: `You gave your weekly of **${formatMoney(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default WeeklyCommand;
