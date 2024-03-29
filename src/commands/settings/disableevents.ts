import type { Message } from 'discord.js';
import { getOrCreateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';

abstract class DisableEventsCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'disableevent',
			description: 'Disable events from emitting on you log channel.',
			category: 'settings',
			aliases: ['de'],
			guildOnly: true,
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		// TODO(Isidro): finish the command
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only command');
		const event = args[0].toLowerCase();
		const guildId = message.guild.id;
		const guild = await getOrCreateGuild(guildId);
		await addCD();
		if (guild.log.disabledEvents.includes(event))
			throw new UserError({ identifier: Identifiers.PreconditionDataExists }, 'Event already disabled');
	}
}

export default DisableEventsCommand;
