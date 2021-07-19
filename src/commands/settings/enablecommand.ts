import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class EnableCommandCommand extends GenericCommand {
	constructor() {
		super({
			name: 'enablecomamnd',
			description: 'Enable a command in your server.',
			category: 'settings',
			aliases: ['ec'],
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!args[0]) return message.reply({ content: 'I have to enable a command.' });
		let arg = args[0].toLowerCase();
		const command = this.cobalt.commands.get(arg);
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		if (!command) return message.reply({ content: 'Invalid command' });
		if (!guild.disabledCommands.includes(arg)) return message.reply({ content: 'Already enabled' });
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCommands: guild.disabledCommands.filter(c => c !== command.name),
		});
		return message.channel.send({ content: `Enabled \`${command.name}\`` });
	}
}

export default EnableCommandCommand;
