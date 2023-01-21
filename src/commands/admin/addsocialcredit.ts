import type { Message } from 'discord.js';
import { getOrCreateUser, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { seconds } from '#utils/common';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class addSocialCredit extends GenericCommand {
	public constructor() {
		super({
			name: 'addsocialcredit',
			description: 'Add social credit to someone outstanding.',
			category: 'admin',
			usage: '<user> <amount>',
			cooldown: seconds(5),
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild);
		if (member.id === message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "can't give yourself social credit");
		const amount = Number(args[1]);
		if (Number.isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		await addCD();
		const userData = await getOrCreateUser(member.id);
		if (!userData) throw new Error('Database error');
		const newAmount = userData.socialCredit + amount;
		if (newAmount > 2_000)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				'The max social credit score someone can have is 2,000',
			);
		updateUser(member.id, { socialCredit: newAmount });
		await message.channel.send({
			content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!`,
		});
	}
}

export default addSocialCredit;
