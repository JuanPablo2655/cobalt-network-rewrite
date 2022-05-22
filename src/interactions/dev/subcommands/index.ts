import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';

export async function reboot(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.reply({ content: 'Shutting down.' });
	await cobalt.destory();
}

export async function pay(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	const bot = await cobalt.db.getBot(cobalt.user?.id);
	if (!bot) throw new Error('Missing bot user');
	let isDirector = false;
	bot.directors?.forEach(director => {
		if (director === interaction.user.id) return (isDirector = true);
	});
	if (!isDirector) throw new UserError({ identifer: Identifiers.PreconditionUserPermissions }, 'Not a director');
	if (bot.bank < amount)
		throw new UserError(
			{ identifer: Identifiers.ArgumentIntegerError },
			`I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
		);
	await cobalt.db.updateBot(cobalt.user?.id, { bank: bot.bank - amount });
	await cobalt.econ.addToWallet(user.id, amount);
	return interaction.editReply({
		content: `You paid **${user.username}** **${formatMoney(amount)}** tax money.`,
	});
}
