import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { UserError, Identifiers } from '#lib/errors';
import { getOrCreateGuild, updateGuild } from '#lib/database';

export async function channel(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await updateGuild(interaction.guild.id, {
		welcome: {
			channelId: channel.id,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const message = interaction.options.getString('message', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await updateGuild(interaction.guild.id, {
		welcome: {
			message: message,
		},
	});
	return interaction.reply({ content: `Successfully changed the welcome message to:\n\`${message}\`` });
}

export async function toggle(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const option = interaction.options.getBoolean('toggle', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.welcome?.enabled === option)
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await updateGuild(interaction.guild.id, {
		welcome: {
			enabled: option,
		},
	});
	return interaction.reply({
		content: `Successfully ${option === true ? 'enabled' : 'disabled'} the welcome message.`,
	});
}
