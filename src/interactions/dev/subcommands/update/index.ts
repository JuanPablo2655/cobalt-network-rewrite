import { CommandInteraction, Snowflake } from 'discord.js';
import { CobaltClient } from '../../../../struct/cobaltClient';
import { formatNumber } from '../../../../utils/util';

export async function directors(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const role = interaction.guild?.roles.cache.get('355885679076442112');
	if (!role) return interaction.editReply({ content: `Not in the correct server.` });
	let directors: Snowflake[] = new Array();
	let directorUsernames: string[] = new Array();
	role?.members.forEach(member => {
		directors.push(member.user.id);
	});
	directors.forEach(userId => {
		let username = cobalt.users.cache.get(userId)!.username;
		directorUsernames.push(username);
	});
	await cobalt.db.updateBot(cobalt.user?.id, { directors });
	return interaction.editReply({ content: `Updated directors with ${directorUsernames.join(', ')}` });
}

export async function tax(cobalt: CobaltClient, interaction: CommandInteraction) {
	await interaction.deferReply();
	const bot = await cobalt.db.getBot(cobalt.user?.id);
	if (!bot) return interaction.editReply({ content: 'An error has occured' });
	const tax = interaction.options.getNumber('tax', true);
	if (tax < 1.5) return interaction.editReply({ content: 'Tax must be greater than 1.5%' });
	if (tax > 60) return interaction.editReply({ content: "Can't tax users more than 60%" });
	await cobalt.db.updateBot(cobalt.user?.id, { tax });
	interaction.editReply({ content: `The global tax rate is now **${formatNumber(tax)}%**` });
}
