import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CobaltClient } from '#lib/cobaltClient';
import { formatNumber } from '#utils/util';
import { Default } from '#lib/typings';
import { Identifiers, UserError } from '#lib/errors';

export async function check(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user') ?? interaction.user;
	const userData = await cobalt.db.getUser(user.id);
	const embed = new MessageEmbed()
		.setTitle(`${user.username}'s social credit`)
		.setDescription(
			`**Score:** ${formatNumber(
				userData?.socialCredit ?? Default.SocialCredit,
			)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
		);
	return interaction.editReply({ embeds: [embed] });
}

export async function add(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id == interaction.user.id)
		throw new UserError({ identifer: Identifiers.ArgumentUserError }, "can't give yourself social credit");
	const userData = await cobalt.db.getUser(user.id);
	const newAmount = (userData?.socialCredit ?? Default.SocialCredit) + amount;
	if (newAmount > 2000)
		throw new UserError(
			{ identifer: Identifiers.ArgumentIntegerTooLarge },
			'The max social credit score someone can have is 2,000',
		);
	cobalt.db.updateUser(user.id, { socialCredit: newAmount });
	interaction.editReply({ content: `${user.username} social credit score is now ${formatNumber(newAmount) ?? '0'}!` });
}

export async function remove(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const user = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	if (user.id == interaction.user.id)
		throw new UserError({ identifer: Identifiers.ArgumentUserError }, "Can't remove social credit from yourself");
	const userData = await cobalt.db.getUser(user.id);
	const newAmount = (userData?.socialCredit ?? Default.SocialCredit) + amount;
	if (newAmount < 0)
		throw new UserError(
			{ identifer: Identifiers.ArgumentIntegerTooSmall },
			'The min social credit someone can have is 0',
		);
	cobalt.db.updateUser(user.id, { socialCredit: newAmount });
	interaction.editReply({ content: `${user.username} social credit score is now ${formatNumber(newAmount) ?? '0'}!` });
}
