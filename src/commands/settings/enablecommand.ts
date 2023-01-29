import type { Message } from 'discord.js';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { container } from '#root/Container';

const { commands } = container;
abstract class EnableCommandCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'enablecomamnd',
			description: 'Enable a command in your server.',
			category: 'settings',
			aliases: ['ec'],
			userPermissions: ['Administrator'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only command');
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing arg');
		const arg = args[0].toLowerCase();
		const command = commands.get(arg);
		const guildId = message.guild.id;
		const guild = await getOrCreateGuild(guildId);
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
