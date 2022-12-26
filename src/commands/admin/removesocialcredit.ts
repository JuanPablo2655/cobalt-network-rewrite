import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { seconds } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';
import { createUser, getUser, updateUser } from '#lib/database';

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
		const member = await resolveMember(args[0], message.guild!);
		if (member.id == message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "Can't remove social credit from yourself");
		const amount = Number(args[1]);
		if (isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		addCD();
		const userData = (await getUser(member.id)) ?? (await createUser(member.id));
		if (!userData) throw new Error('Database error');
		const newAmount = userData.socialCredit - amount;
		if (newAmount < 0)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooSmall },
				'The min social credit someone can have is 0',
			);
		updateUser(member.id, { socialCredit: newAmount });
		message.channel.send({ content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!` });
	}
}

export default removeSocialCredit;
