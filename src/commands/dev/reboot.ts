import process from 'node:process';
import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures';

abstract class RebootCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'reboot',
			description: 'Reboot the bot. Only works if using pm2 or anything else similar.',
			category: 'dev',
			devOnly: true,
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		await message.channel.send({ content: 'Shutting down' });
		process.exit(1);
	}
}

export default RebootCommand;
