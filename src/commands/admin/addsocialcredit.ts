import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Default } from '#lib/typings';
import { seconds } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class addSocialCredit extends GenericCommand {
	constructor() {
		super({
			name: 'addsocialcredit',
			description: 'Add social credit to someone outstanding.',
			category: 'admin',
			usage: '<user> <amount>',
			cooldown: seconds(5),
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { db } = this.cobalt.container;
		const member = await resolveMember(args[0], message.guild!);
		if (member.id == message.author.id)
			throw new UserError({ identifer: Identifiers.ArgumentUserError }, "can't give yourself social credit");
		const amount = Number(args[1]);
		if (isNaN(amount)) throw new UserError({ identifer: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		addCD();
		const userData = await db.getUser(member.id);
		const newAmount = (userData?.socialCredit ?? Default.SocialCredit) + amount;
		if (newAmount > 2000)
			throw new UserError(
				{ identifer: Identifiers.ArgumentIntegerTooLarge },
				'The max social credit score someone can have is 2,000',
			);
		db.updateUser(member.id, { socialCredit: newAmount });
		message.channel.send({ content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!` });
	}
}

export default addSocialCredit;
