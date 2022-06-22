import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { CobaltClient } from '#lib/CobaltClient';
import { formatNumber } from '#utils/functions';
import { Default } from '#lib/typings';
import { days } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

export async function rank(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = await cobalt.container.db.getUser(user.id);
	const xpPercent = ((profile?.xp ?? Default.Xp) / cobalt.container.exp.nextLevel(profile?.lvl ?? Default.Level)) * 100;
	const rankEmbed = new EmbedBuilder()
		.setTitle(`${user?.username}'s Rank`)
		.setDescription(
			`**Level**: ${formatNumber(profile?.lvl ?? Default.Level)}\n**Experience**: ${formatNumber(
				profile?.xp ?? Default.Xp,
			)} / ${formatNumber(cobalt.container.exp.nextLevel(profile?.lvl ?? Default.Level))} \`${xpPercent
				.toString()
				.substring(0, 4)}%\``,
		);
	return interaction.reply({ embeds: [rankEmbed] });
}

export async function reputation(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const member = interaction.options.getUser('user', true);
	const author = await cobalt.container.db.getUser(interaction.user.id);
	if (!author) throw new Error('Missing author database entry');
	const user = await cobalt.container.db.getUser(member.id);
	if (member.id === interaction.user.id)
		throw new UserError({ identifer: Identifiers.ArgumentUserError }, "Can't give youself a reputation point!");
	const date = Date.now();
	const cooldown = date + days(1);
	// TODO(Isidro): fix this
	if (!isNaN(author.repTime!) && author.repTime! > date) {
		throw new UserError(
			{ identifer: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(
				author.repTime! - Date.now(),
			)}** left before you can give someone a reputation point!`,
		);
	}
	await cobalt.container.db.updateUser(interaction.user.id, { repTime: cooldown });
	await cobalt.container.db.updateUser(member.id, { rep: user!.rep + 1 });
	return interaction.reply({ content: `You gave **${member.username}** a reputation point!` });
}
