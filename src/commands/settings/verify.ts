import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

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
		const { db } = this.cobalt.container;
		const bot = await db.getBot(this.cobalt.user?.id);
		if (!bot) throw new Error('Missing bot database entry');
		let isDirector = false;
		bot.directors?.forEach(director => {
			if (director === message.author.id) return (isDirector = true);
		});
		if (!isDirector)
			throw new UserError({ identifer: Identifiers.PreconditionUserPermissionsNoPermissions }, 'Not a director');
		const guildId = (message.guild as Guild)?.id;
		const guild = db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		await db.updateGuild(guildId, { verified: true });
		return message.channel.send({ content: 'The server is now verified!' });
	}
}

export default VerifyCommand;
