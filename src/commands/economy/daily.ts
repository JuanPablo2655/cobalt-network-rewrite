import type { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { addToWallet, getOrCreateUser, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { days } from '#utils/common';
import { addMulti, formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class DailyCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'daily',
			description: 'Claim your daily reward',
			category: 'economy',
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = await getOrCreateUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + days(1);
		if (user.daily.getTime() > date)
			throw new UserError(
				{ identifier: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(
					user.daily.getTime() - Date.now(),
				)}** left before you can claim your daily!`,
			);
		await addCD();
		if (member.id === message.author.id) {
			const dailyAmount = Math.floor(250 + Math.random() * 150);
			await updateUser(message.author.id, { daily: new Date(cooldown) });
			await addToWallet(member.id, dailyAmount);
			return message.channel.send({
				content: `You have received your daily **${formatMoney(dailyAmount)}**.`,
			});
		}

		const dailyAmount = Math.floor(250 + Math.random() * 150);
		const moneyEarned = addMulti(dailyAmount, 10);
		await updateUser(message.author.id, { daily: new Date(cooldown) });
		await addToWallet(member.id, moneyEarned);
		return message.channel.send({
			content: `You gave your daily of **${formatMoney(moneyEarned)}** to **${member.user.username}**.`,
		});
	}
}

export default DailyCommand;
