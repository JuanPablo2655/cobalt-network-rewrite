import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import Interaction from '../../struct/Interaction';

abstract class VcDataInteraction extends Interaction {
	constructor() {
		super({
			name: 'vcdata',
			descrition: "Get your's or someone else's vc data locally or globally.",
			category: 'utility',
			options: [
				{
					type: 3,
					name: 'option',
					description: 'local or global',
					choices: [
						{
							name: 'local',
							value: 'Get VC data in the guild.',
						},
						{
							name: 'global',
							value: 'Get VC data globally.',
						},
					],
					required: true,
				},
				{
					type: 6,
					name: 'user',
					description: 'The user to get the data from.',
				},
			],
		});
	}

	async run(interaction: CommandInteraction) {
		const option = interaction.options.getString('option', true);
		const user = interaction.options.getUser('user') ?? interaction.user;
		const memberData = await this.cobalt.db.getMember(user.id, interaction.guild!.id);
		const userData = await this.cobalt.db.getUser(user.id);
		if (option === 'local') {
			const vcEmbed = new MessageEmbed()
				.setTitle(`${user.username}'s VC Data`)
				.setDescription(`Total Time: **${prettyMilliseconds(memberData!.vcHours)}**`);
			return interaction.reply({ embeds: [vcEmbed] });
		}
		if (option === 'global') {
			const vcEmbed = new MessageEmbed()
				.setTitle(`${user.username}'s Global VC Data`)
				.setDescription(`Total Time: **${prettyMilliseconds(userData!.vcHours)}**`);
			return interaction.reply({ embeds: [vcEmbed] });
		}
	}
}

export default VcDataInteraction;
