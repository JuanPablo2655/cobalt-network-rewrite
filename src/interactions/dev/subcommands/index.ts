import type { ChatInputCommandInteraction } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { addToWallet, getOrCreateBot, updateBot } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { formatMoney } from '#utils/functions';

export async function reboot(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.reply({ content: 'Shutting down.' });
	await cobalt.destroy();
}

export async function pay(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (!cobalt.user) throw new Error('Missing user');
	const bot = await getOrCreateBot(cobalt.user.id);
	let isDirector = false;
	if (bot.directors)
		for (const director of bot.directors) {
			if (director === interaction.user.id) {
				isDirector = true;
			}
		}

	if (!isDirector) throw new UserError({ identifier: Identifiers.PreconditionUserPermissions }, 'Not a director');
	if (bot.bank < amount)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerError },
			`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
		);
	await updateBot(cobalt.user.id, { bank: bot.bank - amount });
	await addToWallet(user.id, amount);
	return interaction.editReply({
		content: `You paid **${user.username}** **${formatMoney(amount)}** tax money.`,
	});
}
