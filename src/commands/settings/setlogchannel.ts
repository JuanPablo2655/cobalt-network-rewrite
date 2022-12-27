import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { resolveGuildTextChannel } from '#utils/resolvers';
import { createGuild, getGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';

abstract class SetLogChannelCommand extends GenericCommand {
	constructor() {
		super({
			name: 'setlogchannel',
			description: 'Set the log channel for you server.',
			category: 'settings',
			aliases: ['slc'],
			guildOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only command');
		const channel = resolveGuildTextChannel(args[0], message.guild);
		const guildId = (message.guild as Guild)?.id;
		const guild = (await getGuild(guildId)) ?? (await createGuild(guildId));
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		await updateGuild(guildId, {
			logChannel: {
				channelId: channel.id,
			},
		});
		return message.channel.send({ content: `Successfully changed the log channel to ${channel}` });
	}
}

export default SetLogChannelCommand;
