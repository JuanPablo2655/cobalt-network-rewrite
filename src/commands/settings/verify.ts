import { Guild, Message } from 'discord.js';
import { GenericCommand } from '@lib/structures/commands';

abstract class VerifyCommand extends GenericCommand {
	constructor() {
		super({
			name: 'verify',
			description: 'Verify a discord server and give them access to the rest of the bot.',
			category: 'settings',
			aliases: ['v'],
			guildOnly: true,
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return;
		let isDirector = false;
		bot.directors?.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector) return message.channel.send({ content: 'not a director!' });
		const guildId = (message.guild as Guild)?.id;
		const guild = this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: "Invalid guild ID, make sure it's correct and try again." });
		await this.cobalt.db.updateGuild(guildId, { verified: true });
		return message.channel.send({ content: 'The server is now verified!' });
	}
}

export default VerifyCommand;
