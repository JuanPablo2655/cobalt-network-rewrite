import { Message } from 'discord.js';
import { Items } from '../../data/items/items';
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
		const yeah = new Items();
		const bruh = yeah.items.filter(i => i.category === args[0]).map(i => `${i.id} - ${i.name} - ${i.category}`);
		return message.channel.send({ content: bruh.join('\n') });
	}
}

export default TestCommand;
