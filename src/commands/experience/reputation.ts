import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { resolveMember } from '#utils/resolvers';
import { createUser, getUser, updateUser } from '#lib/database';
import { days } from '#utils/common';

abstract class ReputationCommand extends GenericCommand {
	constructor() {
		super({
			name: 'reputation',
			description: 'Give someone a reputation point.',
			category: 'experience',
			usage: '<user>',
			aliases: ['rep'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild);
		const author = (await getUser(message.author.id)) ?? (await createUser(message.author.id));
		if (!author) throw new Error('Missing author database entry');
		const user = (await getUser(member.id)) ?? (await createUser(member.id));
		if (!user) throw new Error('Missing user database entry');
		if (member.id === message.author.id)
			throw new UserError({ identifier: Identifiers.ArgumentUserError }, "Can't give yourself a reputation point!");
		const date = Date.now();
		const cooldown = date + days(1);
		if (author.repTime.getTime() > date) {
			throw new UserError(
				{ identifier: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(
					author.repTime.getTime() - Date.now(),
				)}** left before you can give someone a reputation point!`,
			);
		}
		await addCD();
		await updateUser(message.author.id, { repTime: new Date(cooldown) });
		await updateUser(member.id, { rep: user.rep + 1 });
		return message.channel.send({ content: `You gave **${member.user.username}** a reputation point!` });
	}
}

export default ReputationCommand;
