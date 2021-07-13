import { Message, Snowflake } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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
		const role = await this.cobalt.utils.findRole(message, '355885679076442112');
		if (!role) return message.reply({ content: 'Wrong server bruh' });
		addCD();
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
