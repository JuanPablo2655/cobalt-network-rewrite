import type { Message, Snowflake } from 'discord.js';
import { updateBot } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { resolveRole } from '#utils/resolvers';

abstract class UpdateDirectorCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'updatedirector',
			description: 'Update the directors in the bots settings so they can verify new servers.',
			category: 'dev',
			guildOnly: true,
			devOnly: true,
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const role = await resolveRole('355885679076442112', message.guild);
		if (!this.cobalt.user) throw new Error('Cobalt user is not cached');
		await addCD();
		const directors: Snowflake[] = [];
		const directorUsernames: string[] = [];
		role.members.forEach(user => {
			directors.push(user.user.id);
		});

		directors.forEach(userId => {
			const username = this.cobalt.users.cache.get(userId)!.username;
			directorUsernames.push(username);
		});

		await updateBot(this.cobalt.user.id, { directors });
		return message.channel.send({ content: `Updated directors with ${directorUsernames.join(', ')}` });
	}
}

export default UpdateDirectorCommand;
