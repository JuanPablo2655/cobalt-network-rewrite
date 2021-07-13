import { Message, MessageEmbed } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class RankCommand extends GenericCommand {
	constructor() {
		super({
			name: 'rank',
			description: 'Get your or someone elses rank in the server.',
			category: 'experience',
			usage: '[user]',
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
		const user = member?.user;
		const profile = await this.cobalt.db.getUser(user?.id);
		addCD();
		let xpPercent = (profile!.xp / this.cobalt.exp.nextLevel(profile!.lvl)) * 100;
		const rankEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s Rank`)
			.setDescription(
				`**Level**: ${this.cobalt.utils.formatNumber(profile!.lvl)}\n**Experience**: ${this.cobalt.utils.formatNumber(
					profile!.xp,
				)} / ${this.cobalt.utils.formatNumber(this.cobalt.exp.nextLevel(profile!.lvl))} \`${xpPercent
					.toString()
					.substring(0, 4)}%\``,
			);
		message.channel.send({ embeds: [rankEmbed] });
	}
}

export default RankCommand;
