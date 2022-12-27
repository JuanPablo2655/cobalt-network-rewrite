import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { resolveGuildTextChannel } from '#utils/resolvers';
import { createGuild, getGuild, updateGuild } from '#lib/database';

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
		const [option, action, ...leaveMessage] = args;
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Missing Guild');
		const guildId = message.guild.id;
		const guild = (await getGuild(guildId)) ?? (await createGuild(guildId));
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		switch (option) {
			case 'toggle': {
				const choice: boolean = action.toLowerCase() === 'true' || action.toLowerCase() === 'enable';
				await updateGuild(guildId, {
					leaveMessage: {
						enabled: choice,
					},
				});
				return message.channel.send({
					content: `Successfully ${choice === true ? 'enabled' : 'disabled'} the leave message`,
				});
			}
			case 'channel': {
				const channel = await resolveGuildTextChannel(action, message.guild);
				await updateGuild(guildId, {
					leaveMessage: {
						channelId: channel.id,
					},
				});
				return message.channel.send({ content: `Successfully changed the leave channel to ${channel}` });
			}
			case 'message': {
				if (!action)
					throw new UserError(
						{ identifier: Identifiers.ArgsMissing },
						`Do you want to edit or set the message to default?\nExample: \`${guild.prefix}setleavechannel message edit <leave message>\``,
					);
				if (action === 'edit') {
					await updateGuild(guildId, {
						leaveMessage: {
							message: leaveMessage.join(' '),
						},
					});
					return message.channel.send({
						content: `Successfully changed the leave message to:\n\`${leaveMessage.join(' ')}\``,
					});
				}
				if (action === 'default') {
					await updateGuild(guildId, {
						leaveMessage: {
							message: 'Goodbye {user.username}.',
						},
					});
					return message.channel.send({ content: `Successfully changed the leave message to default` });
				}
				break;
			}
			default: {
				throw new UserError(
					{ identifier: Identifiers.ArgsMissing },
					'Please choose between `toggle, channel, or message`',
				);
			}
		}
	}
}

export default UpdateLeaveChannelCommand;
