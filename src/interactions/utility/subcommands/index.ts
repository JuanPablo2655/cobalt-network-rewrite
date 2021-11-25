import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CobaltClient } from '@lib/cobaltClient';
import { formatNumber } from '@utils/util';

export async function check(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user') ?? interaction.user;
	const userData = await cobalt.db.getUser(user.id);
	const embed = new MessageEmbed()
		.setTitle(`${user.username}'s social credit`)
		.setDescription(
			`**Score:** ${formatNumber(userData?.socialCredit ?? 0)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
		);
	return interaction.editReply({ embeds: [embed] });
}

export async function add(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id == interaction.user.id)
		return interaction.editReply({ content: "You can't give yourself social credit score!" });
	const userData = await cobalt.db.getUser(user.id);
	const newAmount = (userData?.socialCredit ?? 0) + amount;
	if (newAmount > 2000) return interaction.editReply({ content: 'The max social credit someone can have is 2,000!' });
	cobalt.db.updateUser(user.id, { socialCredit: newAmount });
	interaction.editReply({ content: `${user.username} social credit score is now ${formatNumber(newAmount)}!` });
}

export async function remove(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id == interaction.user.id)
		return interaction.editReply({ content: "can't remove social credit from yourself!" });
	const userData = await cobalt.db.getUser(user.id);
	const newAmount = (userData?.socialCredit ?? 0) + amount;
	if (newAmount < 0) return interaction.editReply({ content: 'The min social credit someone can have is 0!' });
	cobalt.db.updateUser(user.id, { socialCredit: newAmount });
	interaction.editReply({ content: `${user.username} social credit score is now ${formatNumber(newAmount)}!` });
}
