import type { ChatInputCommandInteraction, Snowflake } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { updateBot } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';

export async function directors(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const role = interaction.guild.roles.cache.get('355885679076442112');
	if (!role) throw new UserError({ identifier: Identifiers.ArgumentUserError }, 'Not in the correct server');
	if (!cobalt.user) throw new Error('Missing user');
	const directors: Snowflake[] = new Array<Snowflake>();
	const directorUsernames: string[] = new Array<string>();
	for (const [_, member] of role.members) {
		directors.push(member.user.id);
	}

	for (const userId of directors) {
		const username = cobalt.users.cache.get(userId)!.username;
		directorUsernames.push(username);
	}

	await updateBot(cobalt.user.id, { directors });
	return interaction.editReply({ content: `Updated directors with ${directorUsernames.join(', ')}` });
}

export async function tax(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	if (!cobalt.user) throw new Error('Missing user');
	const tax = interaction.options.getNumber('tax', true);
	if (tax < 1.5)
		throw new UserError({ identifier: Identifiers.ArgumentNumberTooSmall }, 'Tax must be greater than 1.5%');
	if (tax > 60)
		throw new UserError({ identifier: Identifiers.ArgumentNumberTooLarge }, "Tax can't be greater than 60%");
	await updateBot(cobalt.user.id, { tax });
	await interaction.editReply({ content: `The global tax rate is now **${formatNumber(tax)}%**` });
}
