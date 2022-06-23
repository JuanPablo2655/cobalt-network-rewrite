import { ChatInputCommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';
import { Identifiers, UserError } from '#lib/errors';

export async function channel(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db } = cobalt.container;
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: guild.leaveMessage?.message ?? null,
			channelId: channel.id,
			enabled: guild.leaveMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db } = cobalt.container;
	const message = interaction.options.getString('message', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: message,
			channelId: guild.leaveMessage?.channelId ?? null,
			enabled: guild.leaveMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the leave message to:\n\`${message}\`` });
}

export async function toggle(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const { db } = cobalt.container;
	const option = interaction.options.getBoolean('toggle', true);
	if (!interaction.guild) return interaction.reply({ content: `Must be in a guild!` });
	const guild = await db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.leaveMessage?.enabled === option)
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: guild.leaveMessage?.message ?? null,
			channelId: guild.leaveMessage?.channelId ?? null,
			enabled: option,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the leave message.` });
}
