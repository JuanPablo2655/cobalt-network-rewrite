import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures';
/* import { resolveRole } from '#utils/resolvers'; */

abstract class TestCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'test',
			description: 'Test command for the bot when testing new features.',
			category: 'dev',
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		/* 		const role = await resolveRole(args[0], message.guild!); */
		return message.channel.send({ content: `${message.guild?.roles.everyone.id}` });
	}
}

export default TestCommand;
