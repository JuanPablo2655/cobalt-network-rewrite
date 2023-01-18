import { type Message, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { getOrCreateMember, getOrCreateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { formatNumber } from '#utils/functions';
import { resolveMember } from '#utils/resolvers';

abstract class GetVcTimeCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'getvctime',
			description: "see how much time you've spent in vc",
			category: 'utility',
			usage: '<local|global> [user]',
			guildOnly: true,
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const [option] = args;
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'guild only command');
		const member = await resolveMember(args[1], message.guild).catch(() => message.member);
		if (!member) throw new UserError({ identifier: Identifiers.ArgumentMemberMissingGuild }, 'Invalid member');
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only');
		const memberData = await getOrCreateMember(member.id, message.guild.id);
		if (!memberData) throw new Error('Missing member database entry');
		const user = await getOrCreateUser(member.id);
		if (!user) throw new Error('Missing user database entry');
		await addCD();
		switch (option?.toLowerCase() ?? '') {
			case 'local': {
				if (memberData.vcHours.length === 0) return message.reply({ content: "You haven't joined VC in this server!" });
				// TODO(Isidro): condense reduce and sort into one loop
				const sum = memberData.vcHours.reduce((a, b) => a + b);
				const average = sum / memberData.vcHours.length;
				const sorted = memberData.vcHours.sort((a, b) => b - a);
				const vcEmbed = new EmbedBuilder()
					.setTitle(`${member?.user.username}'s VC Data`)
					.setDescription(
						`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
							average,
						)}\n**Min Time:** ${prettyMilliseconds(
							sorted[memberData.vcHours.length - 1],
						)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
							memberData.vcHours.length,
						)}`,
					);
				return message.channel.send({ embeds: [vcEmbed] });
			}

			case 'global': {
				if (user.vcHours.length === 0) return message.reply({ content: "You haven't joined VC once!" });
				// TODO(Isidro): condense reduce and sort into one loop
				const sum = user.vcHours.reduce((a, b) => a + b);
				const average = sum / user.vcHours.length;
				const sorted = user.vcHours.sort((a, b) => b - a);
				const vcEmbed = new EmbedBuilder()
					.setTitle(`${member.user.username}'s Global VC Data`)
					.setDescription(
						`**Total Time:** ${prettyMilliseconds(sum)}\n**Average Time:** ${prettyMilliseconds(
							average,
						)}\n**Min Time:** ${prettyMilliseconds(
							sorted[user.vcHours.length - 1],
						)}\n**Max Time:** ${prettyMilliseconds(sorted[0])}\n**Number of VCs:** ${formatNumber(
							user.vcHours.length,
						)}`,
					);
				return message.channel.send({ embeds: [vcEmbed] });
			}

			default: {
				throw new UserError(
					{ identifier: Identifiers.ArgsMissing },
					`Please supply either \`local\` or \`global\` as the parameter please!`,
				);
			}
		}
	}
}

export default GetVcTimeCommand;
