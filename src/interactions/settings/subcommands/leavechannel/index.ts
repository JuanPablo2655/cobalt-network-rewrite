import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/cobaltClient';

export async function channel(cobalt: CobaltClient, interaction: CommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) return interaction.reply({ content: `Must be in a guild!` });
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: guild.leaveMessage?.message ?? null,
			channelId: channel.id,
			enabled: guild.leaveMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(cobalt: CobaltClient, interaction: CommandInteraction) {
	const message = interaction.options.getString('message', true);
	if (!interaction.guild) return interaction.reply({ content: `Must be in a guild!` });
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: message,
			channelId: guild.leaveMessage?.channelId ?? null,
			enabled: guild.leaveMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the leave message to:\n\`${message}\`` });
}

export async function toggle(cobalt: CobaltClient, interaction: CommandInteraction) {
	const option = interaction.options.getBoolean('toggle', true);
	if (!interaction.guild) return interaction.reply({ content: `Must be in a guild!` });
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) return;
	if (guild.leaveMessage?.enabled === option)
		return interaction.reply({ content: `Already ${option}`, ephemeral: true });
	await cobalt.db.updateGuild(interaction.guild.id, {
		leaveMessage: {
			message: guild.leaveMessage?.message ?? null,
			channelId: guild.leaveMessage?.channelId ?? null,
			enabled: option,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the leave message.` });
}
