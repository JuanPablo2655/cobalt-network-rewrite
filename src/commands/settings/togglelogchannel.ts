import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class ToggleLogChannelCommand extends GenericCommand {
	constructor() {
		super({
			name: 'togglelogchannel',
			description: 'Toggle the log channel to either send or ignore audit logs.',
			category: 'settings',
			aliases: ['tlc'],
			guildOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const option: boolean = args[0].toLowerCase() === 'true' || args[0].toLowerCase() === 'enable';
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		addCD();
		if (guild.logChannel.enabled === option) return message.reply({ content: `already ${option}` });
		await this.cobalt.db.updateGuild(guildId, {
			logChannel: {
				enabled: option,
				disabledEvents: guild.logChannel.disabledEvents,
				channelId: guild.logChannel.channelId,
			},
		});
		return message.channel.send({
			content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.`,
		});
	}
}

export default ToggleLogChannelCommand;
