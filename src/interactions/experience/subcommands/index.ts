import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { CobaltClient } from '#lib/CobaltClient';
import { formatNumber } from '#utils/functions';
import { days } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { createUser, getUser, nextLevel, updateUser } from '#lib/database';

export async function rank(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = (await getUser(user.id)) ?? (await createUser(user.id));
	if (!profile) throw new Error('Missing user database entry');
	const xpPercent = (profile.xp / nextLevel(profile.level)) * 100;
	const rankEmbed = new EmbedBuilder()
		.setTitle(`${user.username}'s Rank`)
		.setDescription(
			`**Level**: ${formatNumber(profile.level)}\n**Experience**: ${formatNumber(profile.xp)} / ${formatNumber(
				nextLevel(profile.level),
			)} \`${xpPercent.toString().substring(0, 4)}%\``,
		);
	return interaction.reply({ embeds: [rankEmbed] });
}

export async function reputation(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const member = interaction.options.getUser('user', true);
	const author = (await getUser(interaction.user.id)) ?? (await createUser(interaction.user.id));
	if (!author) throw new Error('Missing author database entry');
	const user = (await getUser(member.id)) ?? (await createUser(member.id));
	if (!user) throw new Error('Missing user database entry');
	if (member.id === interaction.user.id)
		throw new UserError({ identifier: Identifiers.ArgumentUserError }, "Can't give yourself a reputation point!");
	const date = Date.now();
	const cooldown = date + days(1);
	// TODO(Isidro): fix this
	if (author.repTime.getTime() > date) {
		throw new UserError(
			{ identifier: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(
				author.repTime.getTime() - Date.now(),
			)}** left before you can give someone a reputation point!`,
		);
	}
	await updateUser(interaction.user.id, { repTime: new Date(cooldown) });
	await updateUser(member.id, { rep: user.rep + 1 });
	return interaction.reply({ content: `You gave **${member.username}** a reputation point!` });
}
