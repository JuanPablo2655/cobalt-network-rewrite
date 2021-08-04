import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '../../../../struct/cobaltClient';

export async function channel(cobalt: CobaltClient, interaction: CommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild!.id, {
		leaveMessage: {
			message: guild.leaveMessage.message,
			channelId: channel.id,
			enabled: guild.leaveMessage.enabled,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function message(cobalt: CobaltClient, interaction: CommandInteraction) {
	const message = interaction.options.getString('message', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild!.id, {
		leaveMessage: {
			message: message,
			channelId: guild.leaveMessage.channelId,
			enabled: guild.leaveMessage.enabled,
		},
	});
	return interaction.reply({ content: `Successfully changed the leave message to:\n\`${message}\`` });
}

export async function toggle(cobalt: CobaltClient, interaction: CommandInteraction) {
	const option = interaction.options.getBoolean('toggle', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	if (guild.leaveMessage.enabled === option)
		return interaction.reply({ content: `Already ${option}`, ephemeral: true });
	await cobalt.db.updateGuild(interaction.guild!.id, {
		leaveMessage: {
			message: guild.leaveMessage.message,
			channelId: guild.leaveMessage.channelId,
			enabled: option,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the leave message.` });
}