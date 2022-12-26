import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { seconds } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';
import { createUser, getUser, updateUser } from '#lib/database';

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
		const member = await resolveMember(args[0], message.guild!);
		if (member.id == message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "can't give yourself social credit");
		const amount = Number(args[1]);
		if (isNaN(amount)) throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, 'Invalid integer');
		addCD();
		const userData = (await getUser(member.id)) ?? (await createUser(member.id));
		if (!userData) throw new Error('Database error');
		const newAmount = userData.socialCredit + amount;
		if (newAmount > 2000)
			throw new UserError(
				{ identifier: Identifiers.ArgumentIntegerTooLarge },
				'The max social credit score someone can have is 2,000',
			);
		updateUser(member.id, { socialCredit: newAmount });
		message.channel.send({ content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!` });
	}
}

export default addSocialCredit;
