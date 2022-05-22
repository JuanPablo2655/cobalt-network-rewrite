import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { UserError, Identifiers } from '#lib/errors';

export async function channel(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await cobalt.db.updateGuild(interaction.guild.id, {
		welcomeMessage: {
			message: guild.welcomeMessage?.message ?? null,
			channelId: channel.id,
			enabled: guild.welcomeMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const message = interaction.options.getString('message', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await cobalt.db.updateGuild(interaction.guild.id, {
		welcomeMessage: {
			message: message,
			channelId: guild.welcomeMessage?.channelId ?? null,
			enabled: guild.welcomeMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the welcome message to:\n\`${message}\`` });
}

export async function toggle(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const option = interaction.options.getBoolean('toggle', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.welcomeMessage?.enabled === option)
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await cobalt.db.updateGuild(interaction.guild.id, {
		welcomeMessage: {
			message: guild.welcomeMessage?.message ?? null,
			channelId: guild.welcomeMessage?.channelId ?? null,
			enabled: option,
		},
	});
	return interaction.reply({
		content: `Successfully ${option === true ? 'enabled' : 'disabled'} the welcome message.`,
	});
}
