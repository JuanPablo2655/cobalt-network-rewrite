import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember, formatNumber } from '#utils/util';
import { Default } from '#lib/typings';
import { seconds } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

abstract class removeSocialCredit extends GenericCommand {
	constructor() {
		super({
			name: 'removesocialcredit',
			description: 'Remove social credit from someone.',
			category: 'admin',
			usage: '<user> <amount>',
			cooldown: seconds(5),
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args);
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberError }, 'Invalid member');
		if (member.id == message.author.id)
			throw new UserError({ identifer: Identifiers.ArgumentUserError }, "Can't remove social credit from yourself");
		const amount = Number(args[1]);
		if (isNaN(amount)) throw new UserError({ identifer: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		addCD();
		const userData = await this.cobalt.db.getUser(member.id);
		const newAmount = (userData?.socialCredit ?? Default.SocialCredit) - amount;
		if (newAmount < 0)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerTooSmall },
				'The min social credit someone can have is 0!',
			);
		this.cobalt.db.updateUser(member.id, { socialCredit: newAmount });
		message.channel.send({ content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!` });
	}
}

export default removeSocialCredit;
