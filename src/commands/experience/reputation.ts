import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const member = await this.cobalt.utils.findMember(message, args);
		if (!member) return message.reply('Please pick a valid member');
		const author = await this.cobalt.db.getUser(message.author.id);
		if (!author) return message.reply('An error occured');
		const user = await this.cobalt.db.getUser(member.id);
		if (!user) return message.reply('An error occured');
		const date = Date.now();
		const cooldown = date + 86400000;
		if (!isNaN(author.repTime) && author.repTime > date) {
			return message.reply(
				`You still have **${prettyMilliseconds(
					author.repTime - Date.now(),
				)}** left before you can give someone a reputation point!`,
			);
		}
		addCD();
		await this.cobalt.db.updateUser(message.author.id, { repTime: cooldown });
		await this.cobalt.db.updateUser(member.id, { rep: user.rep + 1 });
		return message.channel.send(`You gave **${member.user.username}** a reputation point!`);
	}
}

export default ReputationCommand;
