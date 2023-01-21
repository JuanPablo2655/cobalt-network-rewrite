import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { getOrCreateUser, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';

export async function check(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user') ?? interaction.user;
	const userData = await getOrCreateUser(user.id);
	if (!userData) throw new Error('Missing user database entry');
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s social credit`)
		.setDescription(
			`**Score:** ${formatNumber(userData.socialCredit)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
		);
	return interaction.editReply({ embeds: [embed] });
}

export async function add(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id === interaction.user.id)
		throw new UserError({ identifier: Identifiers.ArgumentUserError }, "can't give yourself social credit");
	const userData = await getOrCreateUser(user.id);
	if (!userData) throw new Error('Missing user database entry');
	const newAmount = userData.socialCredit + amount;
	if (newAmount > 2_000)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerTooLarge },
			'The max social credit score someone can have is 2,000',
		);
	await updateUser(user.id, { socialCredit: newAmount });
	await interaction.editReply({
		content: `${user.username} social credit score is now ${formatNumber(newAmount) ?? '0'}!`,
	});
}

export async function remove(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id === interaction.user.id)
		throw new UserError({ identifier: Identifiers.ArgumentUserError }, "Can't remove social credit from yourself");
	const userData = await getOrCreateUser(user.id);
	if (!userData) throw new Error('Missing user database entry');
	const newAmount = userData.socialCredit + amount;
	if (newAmount < 0)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerTooSmall },
			'The min social credit someone can have is 0',
		);
	await updateUser(user.id, { socialCredit: newAmount });
	await interaction.editReply({
		content: `${user.username} social credit score is now ${formatNumber(newAmount) ?? '0'}!`,
	});
}
