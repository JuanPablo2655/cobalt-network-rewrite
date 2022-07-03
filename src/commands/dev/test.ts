import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { resolveMember } from '#utils/functions';

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
		const member = await resolveMember(args[0], message.guild!);
		return message.channel.send({ content: `${member}` });
	}
}

export default TestCommand;
