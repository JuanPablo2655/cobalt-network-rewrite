import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class DisableCategoryCommand extends GenericCommand {
	constructor() {
		super({
			name: 'disablecategory',
			description: 'Disable a category in your server',
			category: 'settings',
			aliases: ['dcat'],
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const saveCategories = ['dev', 'settings'];
		if (!args[0]) return message.reply({ content: 'I have to disable a category.' });
		let arg = args[0].toLowerCase();
		const categories = this.removeDuplicates(this.cobalt.commands.map(c => c.category));
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		if (!categories.includes(arg)) return message.reply({ content: 'Invalid category' });
		if (saveCategories.includes(arg)) return message.reply({ content: `Can't disabled ${arg} category` });
		if (guild.disabledCategories.includes(arg)) return message.reply({ content: 'Already disabled' });
		addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCategories: [...guild.disabledCategories, arg],
		});
		return message.channel.send({ content: `Disabled \`${arg}\`` });
	}

	removeDuplicates(array: Array<string>) {
		return [...new Set(array)];
	}
}

export default DisableCategoryCommand;
