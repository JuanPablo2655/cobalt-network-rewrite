import { CommandInteraction } from 'discord.js';
import { CobaltClient } from '#lib/cobaltClient';
import { Identifiers, UserError } from '#lib/errors';

export async function channel(cobalt: CobaltClient, interaction: CommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	await cobalt.db.updateGuild(interaction.guild.id, {
		logChannel: {
			enabled: guild.logChannel?.enabled ?? true,
			disabledEvents: guild.logChannel?.disabledEvents ?? [],
			channelId: channel.id,
		},
	});
	return interaction.reply({ content: `Successfully changed the log channel to ${channel}` });
}

export async function toggle(cobalt: CobaltClient, interaction: CommandInteraction) {
	const option = interaction.options.getBoolean('boolean', true);
	if (!interaction.guild) throw new UserError({ identifer: Identifiers.PreconditionGuildOnly }, 'Must be in a guild');
	const guild = await cobalt.db.getGuild(interaction.guild.id);
	if (!guild) throw new Error('Missing guild database entry');
	if (guild.logChannel?.enabled === option)
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, `Already ${option}`);
	await cobalt.db.updateGuild(interaction.guild.id, {
		logChannel: {
			enabled: option,
			disabledEvents: guild.logChannel?.disabledEvents ?? [],
			channelId: guild.logChannel?.channelId ?? null,
		},
	});
	return interaction.reply({ content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.` });
}
