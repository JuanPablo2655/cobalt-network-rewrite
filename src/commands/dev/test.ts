import { Message } from 'discord.js';
import { Items } from '../../data/items';
import GenericCommand from '../../struct/GenericCommand';

abstract class TestCommand extends GenericCommand {
	constructor() {
		super({
			name: 'test',
			description: 'Test comamnd for the bot when testing new features.',
			category: 'dev',
		});
	}

	async run(message: Message, _args: string[], addCD: Function) {
		addCD();
		const bruh = Items.map(i => `${i.id} - ${i.name} - ${i.data}`);
		return message.channel.send({ content: bruh.join('\n') });
	}
}

export default TestCommand;
