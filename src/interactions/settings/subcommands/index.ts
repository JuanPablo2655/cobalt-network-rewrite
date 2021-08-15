import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '../../../struct/cobaltClient';

export async function category(cobalt: CobaltClient, interaction: CommandInteraction) {
	const saveCategories = ['dev', 'settings'];
	const categories = removeDuplicates(cobalt.commands.map(c => c.category));
	const category = interaction.options.getString('category', true).toLowerCase();
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await cobalt.db.getGuild(interaction.guildId!);
	if (!guild) return;
	if (!categories.includes(category)) return interaction.reply({ content: 'Invalid category' });
	if (saveCategories.includes(category))
		return interaction.reply({ content: `Can't disabled **${category}** category` });
	if (guild.disabledCategories.includes(category) && option === true)
		return interaction.reply({ content: `${category} is already disabled.` });
	if (!guild.disabledCategories.includes(category) && option === false)
		return interaction.reply({ content: `${category} is already enabled.` });
	if (option === true) {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCategories: [...guild.disabledCategories, category],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCategories: guild.disabledCategories.filter(c => c !== category),
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
	if (!guild) return;
	if (!command) return interaction.reply({ content: 'Invalid command' });
	if (saveCommands.includes(command.name)) return interaction.reply({ content: "Can't disable this command" });
	if (saveCategories.includes(command?.category))
		return interaction.reply({ content: `Can't disable commands in ${command?.category}` });
	if (guild.disabledCommands.includes(command.name) && option === true)
		return interaction.reply({ content: 'Already disabled.' });
	if (!guild.disabledCommands.includes(command.name) && option === false)
		return interaction.reply({ content: 'Already enabled.' });
	if (option === true) {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCommands: [...guild.disabledCommands, command.name],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guildId!, {
			disabledCommands: guild.disabledCommands.filter(c => c !== command.name),
		});
	}
}

// export async function event(cobalt: CobaltClient, interaction: CommandInteraction) {} // TODO

function removeDuplicates(array: Array<string>) {
	return [...new Set(array)];
}
