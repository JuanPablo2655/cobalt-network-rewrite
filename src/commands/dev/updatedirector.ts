import { Message, Snowflake } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findRole } from '#utils/util';
import { Identifiers, UserError } from '#lib/errors';

abstract class UpdateDirectorCommand extends GenericCommand {
	constructor() {
		super({
			name: 'updatedirector',
			description: 'Update the directors in the bots settings so they can verify new servers.',
			category: 'dev',
			guildOnly: true,
			devOnly: true,
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		const role = await findRole(message, '355885679076442112');
		if (!role) throw new UserError({ identifer: Identifiers.ArgumentUserError }, 'Not in the correct server');
		await addCD();
		let directors: Snowflake[] = new Array();
		let directorUsernames: string[] = new Array();
		role?.members.forEach(user => {
			directors.push(user.user.id);
		});

		directors.forEach(userId => {
			let username = this.cobalt.users.cache.get(userId)!.username;
			directorUsernames.push(username);
		});

		await this.cobalt.db.updateBot(this.cobalt.user?.id, { directors });
		return message.channel.send({ content: `Updated directors with ${directorUsernames.join(', ')}` });
	}
}

export default UpdateDirectorCommand;
