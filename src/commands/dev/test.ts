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

	async run(message: Message, args: string[], addCD: Function) {
		addCD();
		const bruh = Items.filter(i => (i.data[args[0]] !== undefined ? i.data[args[0]] : i)).map(
			i => `${i.id} - ${i.name}`,
		);
		return message.channel.send({ content: this.cobalt.utils.trim(bruh.join('\n'), 2000) });
	}
}

export default TestCommand;
