import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
abstract class PrefixCommand extends GenericCommand {
	constructor() {
		super({
			name: 'prefix',
			description: 'Change the prefix for the server.',
			category: 'settings',
			guildOnly: true,
			userPermissions: ['ManageGuild'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		// TODO(Isidro): refactor to include limits
		// aslkd;fj84rfo34fhweporufhw3p49i7h3098f457h3qew9fh3qpg-hg9-03r - valid prefix lol
		await addCD();
		const prefix = args[0];
		if (!prefix) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing arg');

		await this.cobalt.db.updateGuild(message.guild?.id, { prefix });
		return message.channel.send({ content: `Successfully changed the prefix to \`${prefix}\`.` });
	}
}

export default PrefixCommand;
