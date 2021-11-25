import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';

abstract class RebootCommand extends GenericCommand {
	constructor() {
		super({
			name: 'reboot',
			description: 'Reboot the bot. Only works if using pm2 or anything else simillar.',
			category: 'dev',
			devOnly: true,
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		await message.channel.send({ content: 'Shutting down.' });
		process.exit(1);
	}
}

export default RebootCommand;
