import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { Identifiers, UserError } from '#lib/errors';

export async function channel(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db } = cobalt.container;
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await db.updateGuild(interaction.guild.id, {
		logChannel: {
			enabled: guild.logChannel?.enabled ?? true,
			disabledEvents: guild.logChannel?.disabledEvents ?? [],
			channelId: channel.id,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function toggle(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db } = cobalt.container;
	const option = interaction.options.getBoolean('boolean', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.logChannel?.enabled === option)
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await db.updateGuild(interaction.guild.id, {
		logChannel: {
			enabled: option,
			disabledEvents: guild.logChannel?.disabledEvents ?? [],
			channelId: guild.logChannel?.channelId ?? null,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.` });
}
