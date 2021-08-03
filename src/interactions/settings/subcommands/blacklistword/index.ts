import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '../../../../struct/cobaltClient';

export async function add(cobalt: CobaltClient, interaction: CommandInteraction) {
	const word = interaction.options.getString('word', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	if (guild.blacklistedWords.includes(word)) return interaction.reply({ content: 'Word already exists in the list.' });
	if (guild?.blacklistedWords === null || !guild?.blacklistedWords) {
		await cobalt.db.updateGuild(interaction.guild!.id, {
			blacklistedWords: [word],
		});
	} else {
		await cobalt.db.updateGuild(interaction.guild!.id, {
			blacklistedWords: [...guild.blacklistedWords, word],
		});
	}
	return interaction.reply({ content: `${word} was added to the list of blacklisted words` });
}

export async function remove(cobalt: CobaltClient, interaction: CommandInteraction) {
	const word = interaction.options.getString('word', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	if (guild.blacklistedWords !== null) {
		if (!guild.blacklistedWords?.includes(word))
			return interaction.reply({ content: 'Word does not exist in the list' });
		const words = guild.blacklistedWords?.filter(w => w.toLowerCase() !== word.toLowerCase());
		await cobalt.db.updateGuild(interaction.guild!.id, { blacklistedWords: words });
		return interaction.reply({ content: `${word} was removed from the list of blacklisted words` });
	}
	return interaction.reply({ content: 'There are no blacklisted words yet.' });
}

export async function list(cobalt: CobaltClient, interaction: CommandInteraction) {
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	const words = guild.blacklistedWords !== null && guild.blacklistedWords?.map(w => `\`${w}\``).join(', ');
	return interaction.reply({ content: words || 'There are no blacklisted words yet.' });
}
