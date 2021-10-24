import { Message, MessageEmbed } from 'discord.js';
import { GenericCommand } from '../../lib/structures';
import { findMember, formatNumber } from '../../lib/utils/util';

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
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		const user = member?.user;
		const profile = await this.cobalt.db.getUser(user?.id);
		await addCD();
		let xpPercent = (profile!.xp / this.cobalt.exp.nextLevel(profile!.lvl)) * 100;
		const rankEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s Rank`)
			.setDescription(
				`**Level**: ${formatNumber(profile!.lvl)}\n**Experience**: ${formatNumber(profile!.xp)} / ${formatNumber(
					this.cobalt.exp.nextLevel(profile!.lvl),
				)} \`${xpPercent.toString().substring(0, 4)}%\``,
			);
		message.channel.send({ embeds: [rankEmbed] });
	}
}

export default RankCommand;
