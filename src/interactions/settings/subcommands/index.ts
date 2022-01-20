import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/cobaltClient';
import { Identifiers, UserError } from '#lib/errors';

export async function category(cobalt: CobaltClient, interaction: CommandInteraction) {
	const saveCategories = ['dev', 'settings'];
	const categories = removeDuplicates(cobalt.commands.map(c => c.category));
	const category = interaction.options.getString('category', true).toLowerCase();
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await cobalt.db.getGuild(interaction.guildId!);
	if (!guild) throw new Error('Missing guild database entry');
	if (!categories.includes(category))
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid category');
	if (saveCategories.includes(category))
		throw new UserError({ identifer: Identifiers.CategoryDisabled }, `Can't disabled ${category} category`);
	if (guild.disabledCategories?.includes(category) && option === true)
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, 'Already disabled');
	if (!guild.disabledCategories?.includes(category) && option === false)
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Category already enabled');
	if (option === true) {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCategories: [...(guild.disabledCategories ?? []), category],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCategories: guild.disabledCategories?.filter(c => c !== category),
		});
	}
}

export async function command(cobalt: CobaltClient, interaction: CommandInteraction) {
	const saveCommands = ['help', 'enablecommand', 'disablecommand'];
	const saveCategories = ['dev', 'settings'];
	const commandName = interaction.options.getString('name', true).toLowerCase();
	const command = cobalt.commands.get(commandName);
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await cobalt.db.getGuild(interaction.guildId!);
	if (!guild) throw new Error('Missing guid database entry');
	if (!command) throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Invalid command');
	if (saveCommands.includes(command.name))
		throw new UserError({ identifer: Identifiers.CommandDisabled }, `Can't disable \`${command}\``);
	if (saveCategories.includes(command?.category))
		throw new UserError(
			{ identifer: Identifiers.CategoryDisabled },
			`Can't disabled command in \`${command.category}\` category`,
		);
	if (guild.disabledCommands?.includes(command.name) && option === true)
		throw new UserError({ identifer: Identifiers.CommandDisabled }, 'Command already disabled');
	if (!guild.disabledCommands?.includes(command.name) && option === false)
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Commmand already enabled');
	if (option === true) {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCommands: [...(guild.disabledCommands ?? []), command.name],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCommands: guild.disabledCommands?.filter(c => c !== command.name),
		});
	}
}

// export async function event(cobalt: CobaltClient, interaction: CommandInteraction) {} // TODO

function removeDuplicates(array: Array<string>) {
	return [...new Set(array)];
}
