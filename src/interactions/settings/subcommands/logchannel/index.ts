import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { Identifiers, UserError } from '#lib/errors';
import { getOrCreateGuild, updateGuild } from '#lib/database';

export async function channel(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await updateGuild(interaction.guild.id, {
		log: {
			channelId: channel.id,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function toggle(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const option = interaction.options.getBoolean('boolean', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.log?.enabled === option)
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await updateGuild(interaction.guild.id, {
		log: {
			enabled: option,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.` });
}
