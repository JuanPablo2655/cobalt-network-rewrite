import { Guild, Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { resolveGuildTextChannel } from '#utils/resolvers';

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
		const { db } = this.cobalt.container;
		const channel = await resolveGuildTextChannel(args[0], message.guild!);
		const guildId = (message.guild as Guild)?.id;
		const guild = await db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		await db.updateGuild(guildId, {
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
