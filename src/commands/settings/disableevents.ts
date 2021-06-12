import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class DisableEventsCommand extends GenericCommand {
	constructor() {
		super({
			name: 'disableevent',
			description: 'Disable events from emitting on you log channel.',
			category: 'settings',
			aliases: ['de'],
			guildOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const event = args[0].toLowerCase();
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply('An error has occured. Please report it the developer');
		addCD();
		if (guild.logChannel.disabledEvents.includes(event)) return message.reply('Event already disabled');
	}
}

export default DisableEventsCommand;
