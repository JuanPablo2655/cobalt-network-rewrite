import type { ChatInputCommandInteraction } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { container } from '#root/Container';
import { removeDuplicates } from '#utils/functions';

const { commands } = container;

export async function category(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const saveCategories = ['dev', 'settings'];
	const categories = removeDuplicates(commands.map(c => c.category as string));
	const category = interaction.options.getString('category', true).toLowerCase();
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await getOrCreateGuild(interaction.guildId);
	if (!categories.includes(category))
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Invalid category');
	if (saveCategories.includes(category))
		throw new UserError({ identifier: Identifiers.CategoryDisabled }, `Can't disabled ${category} category`);
	if (guild.disabledCategories.includes(category) && option === true)
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, 'Already disabled');
	if (!guild.disabledCategories.includes(category) && option === false)
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Category already enabled');
	if (option === true) {
		await updateGuild(interaction.guildId, {
			disabledCategories: [...guild.disabledCategories, category],
		});
	} else {
		await updateGuild(interaction.guildId, {
			disabledCategories: guild.disabledCategories.filter(c => c !== category),
		});
	}
}

export async function command(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const saveCommands = ['help', 'enablecommand', 'disablecommand'];
	const saveCategories = ['dev', 'settings'];
	const commandName = interaction.options.getString('name', true).toLowerCase();
	const command = commands.get(commandName);
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await getOrCreateGuild(interaction.guildId);
	if (!command) throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Invalid command');
	if (saveCommands.includes(command.name))
		throw new UserError({ identifier: Identifiers.CommandDisabled }, `Can't disable \`${command}\``);
	if (saveCategories.includes(command.category))
		throw new UserError(
			{ identifier: Identifiers.CategoryDisabled },
			`Can't disabled command in \`${command.category}\` category`,
		);
	if (guild.disabledCommands.includes(command.name) && option === true)
		throw new UserError({ identifier: Identifiers.CommandDisabled }, 'Command already disabled');
	if (!guild.disabledCommands.includes(command.name) && option === false)
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Command already enabled');
	if (option === true) {
		await updateGuild(interaction.guildId, {
			disabledCommands: [...guild.disabledCommands, command.name],
		});
	} else {
		await updateGuild(interaction.guildId, {
			disabledCommands: guild.disabledCommands.filter(c => c !== command.name),
		});
	}
}

// export async function event(cobalt: CobaltClient, interaction: ChatInputCommandInteraction) {} // TODO
