import { Message, EmbedBuilder } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Default } from '#lib/typings';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

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
		const { db, exp } = this.cobalt.container;
		const member = await resolveMember(args[0], message.guild!).catch(() => message.member);
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = member.user;
		const profile = await db.getUser(user.id);
		await addCD();
		const xpPercent = ((profile?.xp ?? Default.Xp) / exp.nextLevel(profile?.lvl ?? Default.Level)) * 100;
		const rankEmbed = new EmbedBuilder()
			.setTitle(`${user?.username}'s Rank`)
			.setDescription(
				`**Level**: ${formatNumber(profile?.lvl ?? Default.Level)}\n**Experience**: ${formatNumber(
					profile?.xp ?? Default.Xp,
				)} / ${formatNumber(exp.nextLevel(profile?.lvl ?? Default.Level))} \`${xpPercent
					.toString()
					.substring(0, 4)}%\``,
			);
		message.channel.send({ embeds: [rankEmbed] });
	}
}

export default RankCommand;
