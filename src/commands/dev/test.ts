import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class TestCommand extends GenericCommand {
	constructor() {
		super({
			name: 'test',
			description: 'Test comamnd for the bot when testing new features.',
			category: 'dev',
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		addCD();
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
		const multi = await this.cobalt.utils.calcMulti(member!.user);
		// return message.channel.send({ content: `${member?.user.username} multi: **${multi}%**` });
	}
}

export default TestCommand;
