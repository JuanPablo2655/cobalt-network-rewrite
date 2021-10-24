import { Message, MessageEmbed } from 'discord.js';
import GenericCommand from '../../structures/GenericCommand';
import { findMember, formatMoney } from '../../utils/util';

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
		const bankPercent = (profile!.bank / profile!.bankSpace) * 100;
		const balanceEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s balance`)
			.setDescription(
				`**Wallet**: ${formatMoney(profile!.wallet)}\n**Bank**: ${formatMoney(profile!.bank)} / ${formatMoney(
					profile!.bankSpace,
				)} \`${bankPercent.toString().substring(0, 4)}%\`\n**Net Worth**: ${formatMoney(
					profile!.netWorth,
				)}\n**Bounty**: ${formatMoney(profile!.bounty)}`,
			);
		message.reply({ embeds: [balanceEmbed] });
	}
}

export default BalanceCommand;
