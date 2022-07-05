import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
/* import { resolveRole } from '#utils/resolvers'; */

abstract class TestCommand extends GenericCommand {
	constructor() {
		super({
			name: 'test',
			description: 'Test comamnd for the bot when testing new features.',
			category: 'dev',
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		/* 		const role = await resolveRole(args[0], message.guild!); */
		return message.channel.send({ content: `${message.guild?.roles.everyone.id}` });
	}
}

export default TestCommand;
