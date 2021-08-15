import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import Interaction from '../../struct/Interaction';
import { vcdataCommand } from './options';

abstract class VcDataInteraction extends Interaction {
	constructor() {
		super({
			name: vcdataCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: CommandInteraction) {
		await interaction.deferReply();
		const option = interaction.options.get('option')?.value;
		const user = interaction.options.getUser('user') ?? interaction.user;
		const memberData = await this.cobalt.db.getMember(user.id, interaction.guild!.id);
		const userData = await this.cobalt.db.getUser(user.id);
		if (option === 'local') {
			const vcEmbed = new MessageEmbed()
				.setTitle(`${user.username}'s VC Data`)
				.setDescription(`Total Time: **${prettyMilliseconds(memberData!.vcHours)}**`);
			return interaction.editReply({ embeds: [vcEmbed] });
		}
		if (option === 'global') {
			const vcEmbed = new MessageEmbed()
				.setTitle(`${user.username}'s Global VC Data`)
				.setDescription(`Total Time: **${prettyMilliseconds(userData!.vcHours)}**`);
			return interaction.editReply({ embeds: [vcEmbed] });
		}
	}
}

export default VcDataInteraction;
