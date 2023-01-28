import type { Message } from 'discord.js';
import { getOrCreateUser, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { seconds } from '#utils/common';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class removeSocialCredit extends GenericCommand {
	public constructor() {
		super({
			name: 'removesocialcredit',
			description: 'Remove social credit from someone.',
			category: 'admin',
			usage: '<user> <amount>',
			cooldown: seconds(5),
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild);
		if (member.id === message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "Can't remove social credit from yourself");
		const amount = Number(args[1]);
		if (Number.isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		await addCD();
		const userData = await getOrCreateUser(member.id);
		const newAmount = userData.socialCredit - amount;
		if (newAmount < 0)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooSmall },
				'The min social credit someone can have is 0',
			);
		updateUser(member.id, { socialCredit: newAmount });
		await message.channel.send({
			content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!`,
		});
	}
}

export default removeSocialCredit;
