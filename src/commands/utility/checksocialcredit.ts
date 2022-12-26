import { Message, EmbedBuilder } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { seconds } from '#utils/common';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';
import { createUser, getUser } from '#lib/database';

abstract class checkSocialCredit extends GenericCommand {
	constructor() {
		super({
			name: 'checksocialcredit',
			description: 'Check your or someone elses social credit.',
			category: 'utility',
			usage: '[user]',
			cooldown: seconds(30),
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await resolveMember(args[0], message.guild!).catch(() => message.member);
		if (!member) throw new Error('missing member');
		const user = (await getUser(member.id)) ?? (await createUser(member.id));
		if (!user) throw new Error('missing user database entry');
		addCD();
		const embed = new EmbedBuilder()
			.setTitle(`${member.user.username}'s social credit`)
			.setDescription(
				`**Score:** ${formatNumber(user.socialCredit)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
			);
		return message.channel.send({ embeds: [embed] });
	}
}

export default checkSocialCredit;
