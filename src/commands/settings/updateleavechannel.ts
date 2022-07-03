import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { resolveGuildTextChannel } from '#utils/resolvers';

abstract class UpdateLeaveChannelCommand extends GenericCommand {
	constructor() {
		super({
			name: 'setleavechannel',
			description: 'Manage the leave channel in your server.',
			category: 'settings',
			usage: '<toggle|channel|message> <[<true>|<enable>]|channel ID|[<edit>|<default>]> <null|null|leave message>',
			aliases: ['leavechannel'],
			guildOnly: true,
			userPermissions: ['ManageGuild'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const { db } = this.cobalt.container;
		const [option, action, ...leaveMessage] = args;
		if (!message.guild) throw new UserError({ identifer: 'Missing Guild' }, 'Missing Guild');
		const guildId = message.guild.id;
		const guild = await db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		switch (option) {
			case 'toggle': {
				const choice: boolean = action.toLowerCase() === 'true' || action.toLowerCase() === 'enable';
				await db.updateGuild(guildId, {
					leaveMessage: {
						message: guild.leaveMessage?.message ?? null,
						channelId: guild.leaveMessage?.channelId ?? null,
						enabled: choice,
					},
				});
				return message.channel.send({
					content: `Successfully ${choice === true ? 'enabled' : 'disabled'} the leave message`,
				});
			}
			case 'channel': {
				const channel = await resolveGuildTextChannel(action, message.guild);
				await db.updateGuild(guildId, {
					leaveMessage: {
						message: guild.leaveMessage?.message ?? null,
						channelId: channel.id,
						enabled: guild.leaveMessage?.enabled ?? true,
					},
				});
				return message.channel.send({ content: `Successfully changed the leave channel to ${channel}` });
			}
			case 'message': {
				if (!action)
					throw new UserError(
						{ identifer: Identifiers.ArgsMissing },
						`Do you want to edit or set the message to default?\nExample: \`${guild.prefix}setleavechannel message edit <leave message>\``,
					);
				if (action === 'edit') {
					await db.updateGuild(guildId, {
						leaveMessage: {
							message: leaveMessage.join(' '),
							channelId: guild.leaveMessage?.channelId ?? null,
							enabled: guild.leaveMessage?.enabled ?? true,
						},
					});
					return message.channel.send({
						content: `Successfully changed the leave message to:\n\`${leaveMessage.join(' ')}\``,
					});
				}
				if (action === 'default') {
					await db.updateGuild(guildId, {
						leaveMessage: {
							message: 'Goodbye {user.username}.',
							channelId: guild.leaveMessage?.channelId ?? null,
							enabled: guild.leaveMessage?.enabled ?? true,
						},
					});
					return message.channel.send({ content: `Successfully changed the leave message to default` });
				}
				break;
			}
			default: {
				throw new UserError(
					{ identifer: Identifiers.ArgsMissing },
					'Please choose between `toggle, channel, or message`',
				);
			}
		}
	}
}

export default UpdateLeaveChannelCommand;
