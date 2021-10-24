import { Guild, Message } from 'discord.js';
import { GenericCommand } from '../../lib/structures';
import { findChannel } from '../../lib/utils/util';

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
		if (!channel)
			return message.reply({ content: "Didn't find the text channel. Please try again with a valid channel" });
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
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
