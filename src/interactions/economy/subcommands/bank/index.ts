import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Default } from '#lib/typings';
import { Identifiers, UserError } from '#lib/errors';

export async function deposit(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db, econ } = cobalt.container;
	const profile = await db.getUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if ((profile?.wallet ?? Default.Wallet) - amount <= 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooSmall }, "You don't have that much money");
	if ((profile?.bank ?? Default.Bank) + amount > (profile?.bankSpace ?? Default.BankSpace))
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooLarge }, "You don't have that much bank space");
	if (amount < 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerError }, "You can't deposit negative money");
	await econ.removeFromWallet(interaction.user.id, amount);
	await econ.addToBank(interaction.user.id, amount);
	return interaction.reply({
		content: `You deposited **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			(profile?.bank ?? Default.Bank) + amount,
		)}**`,
	});
}

export async function withdraw(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db, econ } = cobalt.container;
	const profile = await db.getUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if ((profile?.bank ?? Default.Bank) - amount <= 0)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerTooLarge },
			"You don't have that much money deposited",
		);
	if (amount <= 0)
		throw new UserError({ identifier: Identifiers.ArgumentIntegerTooLarge }, "You can't withdraw money you don't have");
	await econ.removeFromBank(interaction.user.id, amount);
	await econ.addToWallet(interaction.user.id, amount);
	return interaction.reply({
		content: `You withdrew **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			(profile?.bank ?? Default.Bank) - amount,
		)}**`,
	});
}
