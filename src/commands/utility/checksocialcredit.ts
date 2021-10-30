import { Message, MessageEmbed } from 'discord.js';
import { GenericCommand } from '@lib/structures/commands';
import { findMember, formatNumber } from '@utils/util';

abstract class checkSocialCredit extends GenericCommand {
	constructor() {
		super({
			name: 'checksocialcredit',
			description: 'Check your or someone elses social credit.',
			category: 'utility',
			usage: '[user]',
			cooldown: 30,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		addCD();
		const user = await this.cobalt.db.getUser(member?.id);
		const embed = new MessageEmbed()
			.setTitle(`${member?.user.username}'s social credit`)
			.setDescription(
				`**Score:** ${formatNumber(user?.socialCredit ?? 0)} / 2,000\nReduced Taxes: **0%**\nBonus Rewards: **0%**`,
			);
		return message.channel.send({ embeds: [embed] });
	}
}

export default checkSocialCredit;
