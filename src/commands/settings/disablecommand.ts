import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const saveCommands = ['help', 'enablecommand', 'disablecommand'];
		const saveCategories = ['dev', 'settings'];
		if (!args[0]) return message.reply('I have to disable a command.');
		let arg = args[0].toLowerCase();
		const command = this.cobalt.commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply('An error has occured. Please report it the developer');
		if (!command) return message.reply('Invalid command');
		if (saveCommands.includes(command.name)) return message.reply("Can't disable this command");
		if (saveCategories.includes(command?.category))
			return message.reply(`Can't disable commands in ${command?.category}`);
		if (guild.disabledCommands.includes(arg)) return message.reply('Already disabled.');
		addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCommands: [...guild.disabledCommands, command.name],
		});
		return message.channel.send(`Disabled \`${command.name}\``);
	}
}

export default DisableCommandCommand;
