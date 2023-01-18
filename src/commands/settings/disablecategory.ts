import type { Guild, Message } from 'discord.js';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { container } from '#root/Container';
import { SAVE_CATEGORIES } from '#utils/constants';
import { removeDuplicates } from '#utils/functions';

const { commands } = container;

abstract class DisableCategoryCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'disablecategory',
			description: 'Disable a category in your server',
			category: 'settings',
			aliases: ['dcat'],
			userPermissions: ['Administrator'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing category');
		const arg = args[0].toLowerCase();
		const categories = removeDuplicates(commands.map(c => c.category as string));
		const guildId = (message.guild as Guild)?.id;
		const guild = await getOrCreateGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		if (!categories.includes(arg))
			throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Invalid category');
		if (SAVE_CATEGORIES.includes(arg))
			throw new UserError({ identifier: Identifiers.CategoryDisabled }, `Can't disabled ${arg} category`);
		if (guild.disabledCategories.includes(arg))
			throw new UserError({ identifier: Identifiers.PreconditionDataExists }, 'Already disabled');
		await addCD();
		await updateGuild(guildId, {
			disabledCategories: [...guild.disabledCategories, arg],
		});
		return message.channel.send({ content: `Disabled \`${arg}\`` });
	}
}

export default DisableCategoryCommand;
