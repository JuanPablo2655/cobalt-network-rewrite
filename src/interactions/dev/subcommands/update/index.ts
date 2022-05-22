import { ChatInputCommandInteraction, Snowflake } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { formatNumber } from '#lib/utils/functions';
import { Identifiers, UserError } from '#lib/errors';

export async function directors(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const role = interaction.guild?.roles.cache.get('355885679076442112');
	if (!role) throw new UserError({ identifer: Identifiers.ArgumentUserError }, 'Not in the correct server');
	const directors: Snowflake[] = new Array<Snowflake>();
	const directorUsernames: string[] = new Array<string>();
	role?.members.forEach(member => {
		directors.push(member.user.id);
	});
	directors.forEach(userId => {
		const username = cobalt.users.cache.get(userId)!.username;
		directorUsernames.push(username);
	});
	await cobalt.db.updateBot(cobalt.user?.id, { directors });
	return interaction.editReply({ content: `Updated directors with ${directorUsernames.join(', ')}` });
}

export async function tax(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction.deferReply();
	const bot = await cobalt.db.getBot(cobalt.user?.id);
	if (!bot) throw new Error('Missing bot user');
	const tax = interaction.options.getNumber('tax', true);
	if (tax < 1.5)
		throw new UserError({ identifer: Identifiers.ArgumentNumberTooSmall }, 'Tax must be greater than 1.5%');
	if (tax > 60) throw new UserError({ identifer: Identifiers.ArgumentNumberTooLarge }, "Tax can't be greater than 60%");
	await cobalt.db.updateBot(cobalt.user?.id, { tax });
	interaction.editReply({ content: `The global tax rate is now **${formatNumber(tax)}%**` });
}
