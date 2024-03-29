import type { ChatInputCommandInteraction } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { addToBank, addToWallet, getOrCreateUser, removeFromBank, removeFromWallet } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { formatMoney } from '#utils/functions';

export async function deposit(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const profile = await getOrCreateUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if (profile.wallet - amount <= 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooSmall }, "You don't have that much money");
	if (profile.bank + amount > profile.bankSpace)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooLarge }, "You don't have that much bank space");
	if (amount < 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, "You can't deposit negative money");
	await removeFromWallet(interaction.user.id, amount);
	await addToBank(interaction.user.id, amount);
	return interaction.reply({
		content: `You deposited **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			profile.bank + amount,
		)}**`,
	});
}

export async function withdraw(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const profile = await getOrCreateUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if (profile.bank - amount <= 0)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerTooLarge },
			"You don't have that much money deposited",
		);
	if (amount <= 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooLarge }, "You can't withdraw money you don't have");
	await removeFromBank(interaction.user.id, amount);
	await addToWallet(interaction.user.id, amount);
	return interaction.reply({
		content: `You withdrew **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			profile.bank - amount,
		)}**`,
	});
}
