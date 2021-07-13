import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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
		addCD();
		await message.channel.send({ content: 'Shutting down.' });
		process.exit(1);
	}
}

export default RebootCommand;
