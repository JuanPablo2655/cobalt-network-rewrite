import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';
import { addToBank, addToWallet, createUser, getUser, removeFromBank, removeFromWallet } from '#lib/database';

export async function deposit(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const profile = (await getUser(interaction.user.id)) ?? (await createUser(interaction.user.id));
	if (!profile) throw new Error('Missing user database entry');
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

export async function withdraw(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const profile = (await getUser(interaction.user.id)) ?? (await createUser(interaction.user.id));
	if (!profile) throw new Error('Missing user database entry');
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
