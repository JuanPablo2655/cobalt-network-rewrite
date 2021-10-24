import { Guild, Message } from 'discord.js';
import { GenericCommand } from '../../structures/commands';

abstract class EnableCategoryCommand extends GenericCommand {
	constructor() {
		super({
			name: 'enablecategory',
			description: 'Enable a category in your server.',
			category: 'settings',
			aliases: ['ecat'],
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!args[0]) return message.reply({ content: 'I have to enable a category' });
		let arg = args[0].toLowerCase();
		const categories = this.removeDuplicates(this.cobalt.commands.map(c => c.category));
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		if (!categories.includes(arg)) return message.reply({ content: 'Invalid category' });
		if (!guild.disabledCategories?.includes(arg)) return message.reply({ content: 'Already enabled' });
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCategories: guild.disabledCategories.filter(c => c !== arg),
		});
		return message.channel.send({ content: `Enabled \`${arg}\`` });
	}

	removeDuplicates(array: Array<string>) {
		return [...new Set(array)];
	}
}

export default EnableCategoryCommand;
