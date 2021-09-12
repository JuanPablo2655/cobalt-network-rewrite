import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '../../../../struct/cobaltClient';
import { formatMoney } from '../../../../utils/util';

export async function deposit(cobalt: CobaltClient, interaction: CommandInteraction) {
	const profile = await cobalt.db.getUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if (profile!.wallet - amount <= 0) return interaction.reply({ content: "You don't have that much money" });
	if (profile!.bank + amount > profile!.bankSpace)
		return interaction.reply({ content: "You don't have that much bank space" });
	if (amount < 0) return interaction.reply({ content: "You can't deposit negative money" });
	await cobalt.econ.removeFromWallet(interaction.user.id, amount);
	await cobalt.econ.addToBank(interaction.user.id, amount);
	return interaction.reply({
		content: `You deposited **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			profile!.bank + amount,
		)}**`,
	});
}

export async function withdraw(cobalt: CobaltClient, interaction: CommandInteraction) {
	const profile = await cobalt.db.getUser(interaction.user.id);
	const amount = interaction.options.getInteger('amount', true);
	if (profile!.bank - amount <= 0) return interaction.reply({ content: "You don't have that much money deposited" });
	if (amount <= 0) return interaction.reply({ content: "You can't withdraw money you don't have" });
	await cobalt.econ.removeFrombank(interaction.user.id, amount);
	await cobalt.econ.addToWallet(interaction.user.id, amount);
	return interaction.reply({
		content: `You withdrew **${formatMoney(amount)}**. Your bank balance is now **${formatMoney(
			profile!.bank - amount,
		)}**`,
	});
}
