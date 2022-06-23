import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { InteractionCommand } from '#lib/structures/commands';
import { formatNumber } from '#utils/functions';
import { vcdataCommand } from './options';

abstract class VcDataInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: vcdataCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();
		const { db } = this.cobalt.container;
		const option = interaction.options.get('option')?.value;
		const user = interaction.options.getUser('user') ?? interaction.user;
		const memberData = await db.getMember(user.id, interaction.guild?.id);
		const userData = await db.getUser(user.id);
		if (option === 'local') {
			if (!memberData?.vcHours) return interaction.editReply({ content: "You haven't joined VC in this server!" });
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
			if (!userData?.vcHours) return interaction.editReply({ content: "You haven't joined VC once!" });
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
