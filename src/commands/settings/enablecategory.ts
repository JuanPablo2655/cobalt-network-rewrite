import type { Message } from 'discord.js';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { container } from '#root/Container';
import { removeDuplicates } from '#utils/functions';

const { commands } = container;

abstract class EnableCategoryCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'enablecategory',
			description: 'Enable a category in your server.',
			category: 'settings',
			aliases: ['ecat'],
			userPermissions: ['Administrator'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only command');
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing arg');
		const arg = args[0].toLowerCase();
		const categories = removeDuplicates(commands.map(c => c.category as string));
		const guildId = message.guild.id;
		const guild = await getOrCreateGuild(guildId);
		if (!categories.includes(arg))
			throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Invalid category');
		if (!guild.disabledCategories.includes(arg))
			throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Category already enabled');
		await addCD();
		await updateGuild(guildId, {
			disabledCategories: guild.disabledCategories.filter(c => c !== arg),
		});
		return message.channel.send({ content: `Enabled \`${arg}\`` });
	}
}

export default EnableCategoryCommand;
