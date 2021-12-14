import { Message, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { GenericCommand } from '#lib/structures/commands';
import { findMember, formatNumber } from '#utils/util';

abstract class GetVcTimeCommand extends GenericCommand {
	constructor() {
		super({
			name: 'getvctime',
			description: "see how much time you've spent in vc",
			category: 'utility',
			usage: '<local|global> [user]',
			guildOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const [option] = args;
		// TODO(Isidro): return an error
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true, index: 1 });
		if (!member) return message.reply({ content: 'Member not found!' });
		const memberData = await this.cobalt.db.getMember(member.id, message.guild?.id);
		const user = await this.cobalt.db.getUser(member.id);
		await addCD();
		switch (option?.toLowerCase() ?? '') {
			case 'local': {
				if (!memberData?.vcHours) return message.reply({ content: "You haven't joined VC in this server!" });
				// TODO(Isidro): condense reduce and sort into one loop
				const sum = memberData.vcHours.reduce((a, b) => a + b);
				const average = sum / memberData.vcHours.length;
				const sorted = memberData.vcHours.sort((a, b) => b - a);
				const vcEmbed = new MessageEmbed()
					.setTitle(`${member?.user.username}'s VC Data`)
					.setDescription(
						`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
							average,
						)}\n**Min Time:** ${prettyMilliseconds(
							sorted[memberData.vcHours.length - 1],
						)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
							memberData.vcHours.length,
						)}`,
					);
				return message.channel.send({ embeds: [vcEmbed] });
			}
			case 'global': {
				if (!user?.vcHours) return message.reply({ content: "You haven't joined VC once!" });
				// TODO(Isidro): condense reduce and sort into one loop
				const sum = user.vcHours.reduce((a, b) => a + b);
				const average = sum / user.vcHours.length;
				const sorted = user.vcHours.sort((a, b) => b - a);
				const vcEmbed = new MessageEmbed()
					.setTitle(`${member?.user.username}'s Global VC Data`)
					.setDescription(
						`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
							average,
						)}\n**Min Time:** ${prettyMilliseconds(
							sorted[user.vcHours.length - 1],
						)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
							user.vcHours.length,
						)}`,
					);
				return message.channel.send({ embeds: [vcEmbed] });
			}
			default: {
				return message.reply({ content: `Please supply either \`local\` or \`global\` as the paramater please!` });
			}
		}
	}
}

export default GetVcTimeCommand;
