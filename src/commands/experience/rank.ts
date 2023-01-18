import { type Message, EmbedBuilder } from 'discord.js';
import { getOrCreateUser, nextLevel } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class RankCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'rank',
			description: 'Get your or someone elses rank in the server.',
			category: 'experience',
			usage: '[user]',
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = member.user;
		const profile = await getOrCreateUser(user.id);
		if (!profile) throw new Error('missing user database entry');
		await addCD();
		const xpPercent = (profile.xp / nextLevel(profile.level)) * 100;
		const rankEmbed = new EmbedBuilder()
			.setTitle(`${user.username}'s Rank`)
			.setDescription(
				`**Level**: ${formatNumber(profile.level)}\n**Experience**: ${formatNumber(profile.xp)} / ${formatNumber(
					nextLevel(profile.level),
				)} \`${xpPercent.toString().slice(0, 4)}%\``,
			);
		await message.channel.send({ embeds: [rankEmbed] });
	}
}

export default RankCommand;
