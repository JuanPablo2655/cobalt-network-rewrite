import { Message, EmbedBuilder } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember } from '#utils/util';
import { Default } from '#lib/typings';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';

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
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = member.user;
		const profile = await this.cobalt.db.getUser(user.id);
		await addCD();
		const xpPercent = ((profile?.xp ?? Default.Xp) / this.cobalt.exp.nextLevel(profile?.lvl ?? Default.Level)) * 100;
		const rankEmbed = new EmbedBuilder()
			.setTitle(`${user?.username}'s Rank`)
			.setDescription(
				`**Level**: ${formatNumber(profile?.lvl ?? Default.Level)}\n**Experience**: ${formatNumber(
					profile?.xp ?? Default.Xp,
				)} / ${formatNumber(this.cobalt.exp.nextLevel(profile?.lvl ?? Default.Level))} \`${xpPercent
					.toString()
					.substring(0, 4)}%\``,
			);
		message.channel.send({ embeds: [rankEmbed] });
	}
}

export default RankCommand;
