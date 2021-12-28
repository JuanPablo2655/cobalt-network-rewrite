import { Message, MessageEmbed } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember, formatMoney } from '#utils/util';
import { Default } from '#lib/typings';
import { Identifiers, UserError } from '#lib/errors';

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
		if (!member) throw new UserError({ identifer: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = member.user;
		const profile = await this.cobalt.db.getUser(user.id);
		const bankPercent = ((profile?.bank ?? Default.Bank) / (profile?.bankSpace ?? Default.BankSpace)) * 100;
		const balanceEmbed = new MessageEmbed()
			.setTitle(`${user?.username}'s balance`)
			.setDescription(
				`**Wallet**: ${formatMoney(profile?.wallet ?? Default.Wallet)}\n**Bank**: ${formatMoney(
					profile?.bank ?? Default.Bank,
				)} / ${formatMoney(profile?.bankSpace ?? Default.BankSpace)} \`${bankPercent
					.toString()
					.substring(0, 4)}%\`\n**Net Worth**: ${formatMoney(
					profile?.netWorth ?? Default.Default,
				)}\n**Bounty**: ${formatMoney(profile?.bounty ?? Default.Default)}`,
			);
		message.reply({ embeds: [balanceEmbed] });
	}
}

export default BalanceCommand;
