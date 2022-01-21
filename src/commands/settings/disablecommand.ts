import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

abstract class DisableCommandCommand extends GenericCommand {
	constructor() {
		super({
			name: 'disablecommand',
			description: 'Disable a command in your server.',
			category: 'settings',
			aliases: ['dc'],
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		// TODO(Isidro): put this into a constant file
		const saveCommands = ['help', 'enablecommand', 'disablecommand'];
		const saveCategories = ['dev', 'settings'];
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing command');
		const arg = args[0].toLowerCase();
		const command = this.cobalt.commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guid database entry');
		if (!command) throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid command');
		if (saveCommands.includes(command.name))
			throw new UserError({ identifer: Identifiers.CommandDisabled }, `Can't disable \`${command}\``);
		if (saveCategories.includes(command?.category))
			throw new UserError(
				{ identifer: Identifiers.CategoryDisabled },
				`Can't disabled command in \`${command.category}\` category`,
			);
		if (guild.disabledCommands?.includes(arg))
			throw new UserError({ identifer: Identifiers.CommandDisabled }, 'Command already disabled');
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCommands: [...(guild.disabledCommands ?? []), command.name],
		});
		return message.channel.send({ content: `Disabled \`${command.name}\`` });
	}
}

export default DisableCommandCommand;
