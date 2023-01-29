import { type Message, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { seconds } from '#utils/common';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class checkSocialCredit extends GenericCommand {
	public constructor() {
		super({
			name: 'checksocialcredit',
			description: 'Check your or someone elses social credit.',
			category: 'utility',
			usage: '[user]',
			cooldown: seconds(30),
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new Error('missing member');
		const user = await getOrCreateUser(member.id);
		await addCD();
		const embed = new EmbedBuilder()
			.setTitle(`${member.user.username}'s social credit`)
			.setDescription(
				`**Score:** ${formatNumber(user.socialCredit)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
			);
		return message.channel.send({ embeds: [embed] });
	}
}

export default checkSocialCredit;
