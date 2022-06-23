import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

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

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		// TODO(Isidro): finish the command
		const event = args[0].toLowerCase();
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.container.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		if (guild.logChannel?.disabledEvents?.includes(event))
			throw new UserError({ identifer: Identifiers.PreconditionDataExists }, 'Event already disabled');
	}
}

export default DisableEventsCommand;
