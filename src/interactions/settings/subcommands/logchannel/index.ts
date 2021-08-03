import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '../../../../struct/cobaltClient';

export async function channel(cobalt: CobaltClient, interaction: CommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	await cobalt.db.updateGuild(interaction.guild!.id, {
		logChannel: {
			enabled: guild.logChannel.enabled,
			disabledEvents: guild.logChannel.disabledEvents,
			channelId: channel.id,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function toggle(cobalt: CobaltClient, interaction: CommandInteraction) {
	const option = interaction.options.getBoolean('boolean', true);
	const guild = await cobalt.db.getGuild(interaction.guild!.id);
	if (!guild) return;
	if (guild.logChannel.enabled === option) return interaction.reply({ content: `Already ${option}`, ephemeral: true });
	await cobalt.db.updateGuild(interaction.guild!.id, {
		logChannel: {
			enabled: option,
			disabledEvents: guild.logChannel.disabledEvents,
			channelId: guild.logChannel.channelId,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.` });
}
