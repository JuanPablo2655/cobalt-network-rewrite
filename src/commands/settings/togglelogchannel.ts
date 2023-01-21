import type { Guild, Message } from 'discord.js';
import { getOrCreateGuild, updateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';

abstract class ToggleLogChannelCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'togglelogchannel',
			description: 'Toggle the log channel to either send or ignore audit logs.',
			category: 'settings',
			aliases: ['tlc'],
			guildOnly: true,
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const option: boolean = args[0].toLowerCase() === 'true' || args[0].toLowerCase() === 'enable';
		const guildId = (message.guild as Guild)?.id;
		const guild = await getOrCreateGuild(guildId);
		if (!guild) throw new Error('Missing database entry');
		await addCD();
		if (guild.log?.enabled === option)
			throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `Already ${option}`);
		await updateGuild(guildId, {
			log: {
				enabled: option,
			},
		});
		return message.channel.send({
			content: `Successfully ${option === true ? 'enabled' : 'disabled'} the log channel.`,
		});
	}
}

export default ToggleLogChannelCommand;
