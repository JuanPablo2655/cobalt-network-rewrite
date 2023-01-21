import { type Message, EmbedBuilder } from 'discord.js';
import { getOrCreateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatMoney } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class BalanceCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'balance',
			description: 'Check your or someone elses balance.',
			category: 'economy',
			usage: '[user]',
			aliases: ['bal'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[0], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Missing member');
		const user = member.user;
		const profile = await getOrCreateUser(user.id);
		if (!profile) throw new Error('Database error');
		await addCD();
		const bankPercent = (profile.bank / profile.bankSpace) * 100;
		const balanceEmbed = new EmbedBuilder()
			.setTitle(`${user?.username}'s balance`)
			.setDescription(
				`**Wallet**: ${formatMoney(profile.wallet)}\n**Bank**: ${formatMoney(profile.bank)} / ${formatMoney(
					profile.bankSpace,
				)} \`${bankPercent.toString().slice(0, 4)}%\`\n**Net Worth**: ${formatMoney(
					profile.netWorth,
				)}\n**Bounty**: ${formatMoney(profile.bounty)}`,
			);
		await message.reply({ embeds: [balanceEmbed] });
	}
}

export default BalanceCommand;
