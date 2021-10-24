import { Message } from 'discord.js';
import { Items } from '../../data/items';
import { GenericCommand } from '../../structures/commands';
import { trim } from '../../utils/util';

abstract class TestCommand extends GenericCommand {
	constructor() {
		super({
			name: 'test',
			description: 'Test comamnd for the bot when testing new features.',
			category: 'dev',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		const bruh = Items.filter(i => (i.data[args[0]] !== undefined ? i.data[args[0]] : i)).map(
			i => `${i.id} - ${i.name}`,
		);
		return message.channel.send({ content: trim(bruh.join('\n'), 2000) });
	}
}

export default TestCommand;
