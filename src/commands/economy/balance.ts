import { Message, MessageEmbed } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		addCD();
		const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
		const user = member?.user;
		const profile = await this.cobalt.db.getUser(user?.id);
		const bankPercent = (profile!.bank / profile!.bankSpace) * 100;
		const balanceEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s balance`)
			.setDescription(
				`**Wallet**: ₡${this.cobalt.utils.formatNumber(profile!.wallet)}\n**Bank**: ₡${this.cobalt.utils.formatNumber(
					profile!.bank,
				)} / ₡${this.cobalt.utils.formatNumber(profile!.bankSpace)} \`${bankPercent
					.toString()
					.substring(0, 4)}%\`\n**Net Worth**: ₡${this.cobalt.utils.formatNumber(
					profile!.netWorth,
				)}\n**Bounty**: ₡${this.cobalt.utils.formatNumber(profile!.bounty)}`,
			);
		message.reply({ embeds: [balanceEmbed] });
	}
}

export default BalanceCommand;
