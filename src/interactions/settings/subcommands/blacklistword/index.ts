import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { Identifiers, UserError } from '#lib/errors';
import { getOrCreateGuild, updateGuild } from '#lib/database';

export async function add(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const word = interaction.options.getString('word', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.blacklistedWords.includes(word))
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `\`${word}\` already exists in the list`);
	await updateGuild(interaction.guild.id, {
		blacklistedWords: [...guild.blacklistedWords, word],
	});

	return interaction.reply({ content: `${word} was added to the list of blacklisted words` });
}

export async function remove(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const word = interaction.options.getString('word', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) return;
	if (guild.blacklistedWords.length === 0)
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'There are no blacklisted words yet');
	if (!guild.blacklistedWords.includes(word))
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Word does not exist in the list');
	const words = guild.blacklistedWords.filter(w => w.toLowerCase() !== word.toLowerCase());
	await updateGuild(interaction.guild.id, { blacklistedWords: words });
	return interaction.reply({ content: `${word} was removed from the list of blacklisted words` });
}

export async function list(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) return;
	const words = guild.blacklistedWords.length !== 0 && guild.blacklistedWords.map(w => `\`${w}\``).join(', ');
	return interaction.editReply({ content: words || 'There are no blacklisted words yet.' });
}
