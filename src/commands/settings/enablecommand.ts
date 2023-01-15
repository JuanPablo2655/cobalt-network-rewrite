import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { container } from '#root/Container';
const { commands } = container;
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
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing arg');
		const arg = args[0].toLowerCase();
		const command = commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await getOrCreateGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		if (!command) throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Invalid command');
		if (!guild.disabledCommands.includes(arg))
			throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Command already enabled');
		await addCD();
		await updateGuild(guildId, {
			disabledCommands: guild.disabledCommands.filter(c => c !== command.name),
		});
		return message.channel.send({ content: `Enabled \`${command.name}\`` });
	}
}

export default EnableCommandCommand;
