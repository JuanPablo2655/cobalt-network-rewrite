import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { CobaltClient } from '@lib/cobaltClient';
import { formatNumber } from '@utils/util';

export async function rank(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = await cobalt.db.getUser(user.id);
	let xpPercent = (profile!.xp / cobalt.exp.nextLevel(profile!.lvl)) * 100;
	const rankEmbed = new MessageEmbed()
		.setTitle(`${user?.username}'s Rank`)
		.setDescription(
			`**Level**: ${formatNumber(profile!.lvl)}\n**Experience**: ${formatNumber(profile!.xp)} / ${formatNumber(
				cobalt.exp.nextLevel(profile!.lvl),
			)} \`${xpPercent.toString().substring(0, 4)}%\``,
		);
	return interaction.reply({ embeds: [rankEmbed] });
}

export async function reputation(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user', true);
	const author = await cobalt.db.getUser(interaction.user.id);
	const user = await cobalt.db.getUser(member.id);
	if (member.id === interaction.user.id)
		return interaction.reply({ content: "Can't give youself a reputation point!" });
	const date = Date.now();
	const cooldown = date + 86400000;
	if (!isNaN(author!.repTime!) && author!.repTime! > date) {
		return interaction.reply({
			content: `You still have **${prettyMilliseconds(
				author!.repTime! - Date.now(),
			)}** left before you can give someone a reputation point!`,
		});
	}
	await cobalt.db.updateUser(interaction.user.id, { repTime: cooldown });
	await cobalt.db.updateUser(member.id, { rep: user!.rep + 1 });
	return interaction.reply({ content: `You gave **${member.username}** a reputation point!` });
}
