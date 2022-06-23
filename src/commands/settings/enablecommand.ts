import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

abstract class EnableCommandCommand extends GenericCommand {
	constructor() {
		super({
			name: 'enablecomamnd',
			description: 'Enable a command in your server.',
			category: 'settings',
			aliases: ['ec'],
			userPermissions: ['Administrator'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { db, commands } = this.cobalt.container;
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing arg');
		const arg = args[0].toLowerCase();
		const command = commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		if (!command) throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid command');
		if (!guild.disabledCommands?.includes(arg))
			throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Commmand already enabled');
		await addCD();
		await db.updateGuild(guildId, {
			disabledCommands: guild.disabledCommands.filter(c => c !== command.name),
		});
		return message.channel.send({ content: `Enabled \`${command.name}\`` });
	}
}

export default EnableCommandCommand;
