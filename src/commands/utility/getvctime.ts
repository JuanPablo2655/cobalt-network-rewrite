import { Message, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const [option] = args;
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true, index: 1 });
		const memberData = await this.cobalt.db.getMember(member!.id, message.guild!.id);
		const user = await this.cobalt.db.getUser(member!.id);
		addCD();
		switch (option?.toLowerCase() ?? '') {
			case 'local': {
				const vcEmbed = new MessageEmbed()
					.setTitle(`${member?.user.username}'s VC Data`)
					.setDescription(`Total Time: **${prettyMilliseconds(memberData!.vcHours)}**`);
				return message.channel.send({ embeds: [vcEmbed] });
			}
			case 'global': {
				const vcEmbed = new MessageEmbed()
					.setTitle(`${member?.user.username}'s Global VC Data`)
					.setDescription(`Total Time: **${prettyMilliseconds(user!.vcHours)}**`);
				return message.channel.send({ embeds: [vcEmbed] });
			}
			default: {
				return message.reply({ content: `Please supply either \`local\` or \`global\` as the paramater please!` });
			}
		}
	}
}

export default GetVcTimeCommand;
