import { Guild, Message } from 'discord.js';
import GenericCommand from '../../structures/GenericCommand';

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
		const saveCommands = ['help', 'enablecommand', 'disablecommand'];
		const saveCategories = ['dev', 'settings'];
		if (!args[0]) return message.reply({ content: 'I have to disable a command.' });
		let arg = args[0].toLowerCase();
		const command = this.cobalt.commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		if (!command) return message.reply({ content: 'Invalid command' });
		if (saveCommands.includes(command.name)) return message.reply({ content: "Can't disable this command" });
		if (saveCategories.includes(command?.category))
			return message.reply({ content: `Can't disable commands in ${command?.category}` });
		if (guild.disabledCommands?.includes(arg)) return message.reply({ content: 'Already disabled.' });
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCommands: [...(guild.disabledCommands ?? []), command.name],
		});
		return message.channel.send({ content: `Disabled \`${command.name}\`` });
	}
}

export default DisableCommandCommand;
