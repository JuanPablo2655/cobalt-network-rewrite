import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { vcdataCommand } from './options.js';
import { getOrCreateMember, getOrCreateUser } from '#lib/database';
import { InteractionCommand } from '#lib/structures';
import { formatNumber } from '#utils/functions';

abstract class VcDataInteractionCommand extends InteractionCommand {
	public constructor() {
		super({
			name: vcdataCommand.name,
			category: 'utility',
		});
	}

	public async run(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();
		const option = interaction.options.get('option')?.value;
		const user = interaction.options.getUser('user') ?? interaction.user;
		const memberData = await getOrCreateMember(user.id, interaction.guild.id);
		const userData = await getOrCreateUser(user.id);
		if (!memberData || !userData) throw new Error('Missing database entry');
		if (option === 'local') {
			if (memberData.vcHours.length === 0)
				return interaction.editReply({ content: "You haven't joined VC in this server!" });
			// TODO(Isidro): condense reduce and sort into one loop
			const sum = memberData.vcHours.reduce((a, b) => a + b);
			const average = sum / memberData.vcHours.length;
			const sorted = memberData.vcHours.sort((a, b) => b - a);
			const vcEmbed = new EmbedBuilder()
				.setTitle(`${user.username}'s VC Data`)
				.setDescription(
					`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
						average,
					)}\n**Min Time:** ${prettyMilliseconds(
						sorted[memberData.vcHours.length - 1],
					)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
						memberData.vcHours.length,
					)}`,
				);
			return interaction.editReply({ embeds: [vcEmbed] });
		}

		if (option === 'global') {
			if (userData.vcHours.length === 0) return interaction.editReply({ content: "You haven't joined VC once!" });
			// TODO(Isidro): condense reduce and sort into one loop
			const sum = userData.vcHours.reduce((a, b) => a + b);
			const average = sum / userData.vcHours.length;
			const sorted = userData.vcHours.sort((a, b) => b - a);
			const vcEmbed = new EmbedBuilder()
				.setTitle(`${user.username}'s Global VC Data`)
				.setDescription(
					`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
						average,
					)}\n**Min Time:** ${prettyMilliseconds(
						sorted[userData.vcHours.length - 1],
					)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
						userData.vcHours.length,
					)}`,
				);
			return interaction.editReply({ embeds: [vcEmbed] });
		}
	}
}

export default VcDataInteractionCommand;
