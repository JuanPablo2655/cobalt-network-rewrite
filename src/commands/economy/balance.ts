import { Message, MessageEmbed } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember, formatMoney } from '#utils/util';

abstract class BalanceCommand extends GenericCommand {
	constructor() {
		super({
			name: 'balance',
			description: 'Check your or someone elses balance.',
			category: 'economy',
			usage: '[user]',
			aliases: ['bal'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		const member = await findMember(this.cobalt, message, args, { allowAuthor: true });
		const user = member?.user;
		const profile = await this.cobalt.db.getUser(user?.id);
		const bankPercent = ((profile?.bank ?? 0) / (profile?.bankSpace ?? 0)) * 100;
		const balanceEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s balance`)
			.setDescription(
				`**Wallet**: ${formatMoney(profile?.wallet ?? 0)}\n**Bank**: ${formatMoney(profile?.bank ?? 0)} / ${formatMoney(
					profile?.bankSpace ?? 0,
				)} \`${bankPercent.toString().substring(0, 4)}%\`\n**Net Worth**: ${formatMoney(
					profile?.netWorth ?? 0,
				)}\n**Bounty**: ${formatMoney(profile?.bounty ?? 0)}`,
			);
		message.reply({ embeds: [balanceEmbed] });
	}
}

export default BalanceCommand;
