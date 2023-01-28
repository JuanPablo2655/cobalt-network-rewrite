import type { ChatInputCommandInteraction } from 'discord.js';
import type { CobaltClient } from '#lib/CobaltClient';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { UserError, Identifiers } from '#lib/errors';

export async function channel(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
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
	await updateGuild(interaction.guild.id, {
		welcome: {
			message,
		},
	});
	return interaction.reply({ content: `Successfully changed the welcome message to:\n\`${message}\`` });
}

export async function toggle(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const option = interaction.options.getBoolean('toggle', true);
	if (!interaction.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await getOrCreateGuild(interaction.guild.id);
	if (guild.welcome.enabled === option)
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
