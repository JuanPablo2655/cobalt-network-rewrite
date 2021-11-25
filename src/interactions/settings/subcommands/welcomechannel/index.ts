import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/cobaltClient';

export async function channel(cobalt: CobaltClient, interaction: CommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild!.id, {
		welcomeMessage: {
			message: guild.welcomeMessage?.message ?? null,
			channelId: channel.id,
			enabled: guild.welcomeMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(cobalt: CobaltClient, interaction: CommandInteraction) {
	const message = interaction.options.getString('message', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild!.id, {
		welcomeMessage: {
			message: message,
			channelId: guild.welcomeMessage?.channelId ?? null,
			enabled: guild.welcomeMessage?.enabled ?? true,
		},
	});
	return interaction.reply({ content: `Successfully changed the welcome message to:\n\`${message}\`` });
}

export async function toggle(cobalt: CobaltClient, interaction: CommandInteraction) {
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	if (guild.welcomeMessage?.enabled === option)
		return interaction.reply({ content: `Already ${option}`, ephemeral: true });
	await cobalt.db.updateGuild(interaction.guild!.id, {
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
