import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

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
		// TODO(Isidro): put this into a constant file
		const saveCategories = ['dev', 'settings'];
		if (!args[0]) throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Missing category');
		const arg = args[0].toLowerCase();
		const categories = this.removeDuplicates(this.cobalt.commands.map(c => c.category));
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		if (!categories.includes(arg))
			throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid category');
		if (saveCategories.includes(arg))
			throw new UserError({ identifer: Identifiers.CategoryDisabled }, `Can't disabled ${arg} category`);
		if (guild.disabledCategories?.includes(arg))
			throw new UserError({ identifer: Identifiers.PreconditionDataExists }, 'Already disabled');
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			disabledCategories: [...(guild.disabledCategories ?? []), arg],
		});
		return message.channel.send({ content: `Disabled \`${arg}\`` });
	}

	removeDuplicates(array: Array<string>) {
		return [...new Set(array)];
	}
}

export default DisableCategoryCommand;
