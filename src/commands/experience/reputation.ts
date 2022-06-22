import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { findMember } from '#utils/util';
import { Identifiers, UserError } from '#lib/errors';

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
		const member = await findMember(this.cobalt, message, args);
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Invalid member');
		const author = await this.cobalt.container.db.getUser(message.author.id);
		if (!author) throw new Error('Missing author database entry');
		const user = await this.cobalt.container.db.getUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		if (member.id === message.author.id)
			throw new UserError({ identifer: Identifiers.ArgumentUserError }, "Can't give youself a reputation point!");
		const date = Date.now();
		const cooldown = date + 86400000;
		if (!isNaN(author.repTime!) && author.repTime! > date) {
			throw new UserError(
				{ identifer: Identifiers.PreconditionCooldown },
				`You still have **${prettyMilliseconds(
					author.repTime! - Date.now(),
				)}** left before you can give someone a reputation point!`,
			);
		}
		await addCD();
		await this.cobalt.container.db.updateUser(message.author.id, { repTime: cooldown });
		await this.cobalt.container.db.updateUser(member.id, { rep: user.rep + 1 });
		return message.channel.send({ content: `You gave **${member.user.username}** a reputation point!` });
	}
}

export default ReputationCommand;
