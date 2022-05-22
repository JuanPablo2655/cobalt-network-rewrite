import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { removeDuplicates } from '#utils/util';

abstract class EnableCategoryCommand extends GenericCommand {
	constructor() {
		super({
			name: 'enablecategory',
			description: 'Enable a category in your server.',
			category: 'settings',
			aliases: ['ecat'],
			userPermissions: ['Administrator'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing arg');
		const arg = args[0].toLowerCase();
		const categories = removeDuplicates(this.cobalt.commands.map(c => c.category as string));
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		if (!categories.includes(arg))
			throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid category');
		if (!guild.disabledCategories?.includes(arg))
			throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Category already enabled');
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCategories: guild.disabledCategories.filter(c => c !== arg),
		});
		return message.channel.send({ content: `Enabled \`${arg}\`` });
	}
}

export default EnableCategoryCommand;
