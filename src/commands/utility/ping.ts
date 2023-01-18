import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures';
import { seconds } from '#utils/common';

abstract class PingCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'ping',
			description: 'Check the bot ping.',
			category: 'utility',
			aliases: ['p'],
			cooldown: seconds(10),
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		const m = await message.reply({ content: 'If you see this neck yourself #owned' });
		const ping = m.createdTimestamp - message.createdTimestamp;
		return m.edit({ content: `Latency: ${ping}ms\nAPI Latency: ${Math.round(this.cobalt.ws.ping)}ms` });
	}
}

export default PingCommand;
