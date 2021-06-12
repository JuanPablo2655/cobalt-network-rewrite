import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const channel = await this.cobalt.utils.findChannel(message, args[0]);
		if (!channel) return message.reply("Didn't find the text channel. Please try again with a valid channel");
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply('An error has occured. Please report it the developer');
		addCD();
		await this.cobalt.db.updateGuild(guildId, {
			logChannel: {
				enabled: guild.logChannel.enabled,
				disabledEvents: guild.logChannel.disabledEvents,
				channelId: channel.id,
			},
		});
		return message.channel.send(`Successfully changed the log channel to ${channel}`);
	}
}

export default SetLogChannelCommand;
