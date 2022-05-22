import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { Identifiers, UserError } from '#lib/errors';

export async function add(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const word = interaction.options.getString('word', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.blacklistedWords?.includes(word))
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, `\`${word}\` already exists in the list`);
	if (guild?.blacklistedWords === null || !guild?.blacklistedWords) {
		await cobalt.db.updateGuild(interaction.guild.id, {
			blacklistedWords: [word],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guild.id, {
			blacklistedWords: [...guild.blacklistedWords, word],
		});
	}
	return interaction.reply({ content: `${word} was added to the list of blacklisted words` });
}

export async function remove(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const word = interaction.options.getString('word', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) return;
	if (guild.blacklistedWords === null)
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'There are no blacklisted words yet');
	if (!guild.blacklistedWords?.includes(word))
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Word does not exist in the list');
	const words = guild.blacklistedWords?.filter(w => w.toLowerCase() !== word.toLowerCase());
	await cobalt.db.updateGuild(interaction.guild.id, { blacklistedWords: words });
	return interaction.reply({ content: `${word} was removed from the list of blacklisted words` });
}

export async function list(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) return;
	const words = guild.blacklistedWords !== null && guild.blacklistedWords?.map(w => `\`${w}\``).join(', ');
	return interaction.editReply({ content: words || 'There are no blacklisted words yet.' });
}
