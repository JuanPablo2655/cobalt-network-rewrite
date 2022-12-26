import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';
import { getBot, updateBot } from '#lib/database';

export async function reboot(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.reply({ content: 'Shutting down.' });
	await cobalt.destroy();
}

export async function pay(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const { econ } = cobalt.container;
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (!cobalt.user) throw new Error('Missing user');
	const bot = await getBot(cobalt.user.id);
	if (!bot) throw new Error('Missing bot user');
	let isDirector = false;
	bot.directors?.forEach(director => {
		if (director === interaction.user.id) return (isDirector = true);
	});
	if (!isDirector) throw new UserError({ identifier: Identifiers.PreconditionUserPermissions }, 'Not a director');
	if (bot.bank < amount)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerError },
			`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
		);
	await updateBot(cobalt.user.id, { bank: bot.bank - amount });
	await econ.addToWallet(user.id, amount);
	return interaction.editReply({
		content: `You paid **${user.username}** **${formatMoney(amount)}** tax money.`,
	});
}
