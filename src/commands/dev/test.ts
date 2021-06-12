import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class TestCommand extends GenericCommand {
	constructor() {
		super({
			name: 'test',
			description: 'Test comamnd for the bot when testing new features.',
			category: 'dev',
			ownerOnly: true,
		});
	}

	async run(message: Message, _args: string[], addCD: Function) {
		addCD();
		const multi = await this.cobalt.utils.calcMulti(message.author);
		return message.channel.send({ content: String(multi) });
	}
}

export default TestCommand;
