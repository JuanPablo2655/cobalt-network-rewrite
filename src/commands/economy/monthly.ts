import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { addMulti, findMember, formatMoney } from '#utils/util';
import { months } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

abstract class MonthlyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'monthly',
			description: 'Claim your monthly reward.',
			category: 'economy',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Member missing');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		const date = Date.now();
		const cooldown = date + months(1);
		if (!isNaN(user.monthly!) && user.monthly! > date)
			throw new UserError(
				{ identifer: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(user.monthly! - Date.now())}** left before you can claim your monthly!`,
			);
		await addCD();
		if (member?.id === message.author.id) {
			const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
			await this.cobalt.db.updateUser(message.author.id, { monthly: cooldown });
			await this.cobalt.econ.addToWallet(member.id, monthlyAmount);
			return message.channel.send({
				content: `You have received your monthly **${formatMoney(monthlyAmount)}**.`,
			});
		}
		const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
		const moneyEarned = addMulti(monthlyAmount, 10);
		await this.cobalt.db.updateUser(message.author.id, { monthly: cooldown });
		await this.cobalt.econ.addToWallet(member!.id, moneyEarned);
		return message.channel.send({
			content: `You gave your monthly of **${formatMoney(moneyEarned)}** to **${member?.user.username}**.`,
		});
	}
}

export default MonthlyCommand;
