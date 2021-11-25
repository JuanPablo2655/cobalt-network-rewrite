import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '@lib/cobaltClient';
import { formatMoney } from '@utils/util';

export async function reboot(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.reply({ content: 'Shutting down.' });
	cobalt.close();
}

export async function pay(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	const bot = await cobalt.db.getBot(cobalt.user?.id);
	if (!bot) return interaction.editReply({ content: 'An error has occured' });
	let isDirector = false;
	bot.directors?.forEach(director => {
		if (director === interaction.user.id) return (isDirector = true);
	});
	if (!isDirector) return interaction.editReply({ content: 'not a director!' });
	if (bot.bank < amount)
		return interaction.editReply({
			content: `I don't have that much. I have **${formatMoney(bot.bank)}** left.`,
		});
	await cobalt.db.updateBot(cobalt.user?.id, { bank: bot.bank - amount });
	await cobalt.econ.addToWallet(user.id, amount);
	return interaction.editReply({
		content: `You paid **${user.username}** **${formatMoney(amount)}** tax money.`,
	});
}
