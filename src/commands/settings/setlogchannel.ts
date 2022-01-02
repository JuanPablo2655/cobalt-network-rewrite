import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findChannel } from '#utils/util';
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
		const channel = await findChannel(message, args[0]);
		if (!channel) throw new UserError({ identifer: Identifiers.ArgumentGuildChannelError }, 'Invalid channel');
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		await this.cobalt.db.updateGuild(guildId, {
			logChannel: {
				enabled: guild.logChannel?.enabled ?? true,
				disabledEvents: guild.logChannel?.disabledEvents ?? null,
				channelId: channel.id,
			},
		});
		return message.channel.send({ content: `Successfully changed the log channel to ${channel}` });
	}
}

export default SetLogChannelCommand;
