import { Guild, Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class UpdateLeaveChannelCommand extends GenericCommand {
	constructor() {
		super({
			name: 'setleavechannel',
			description: 'Manage the leave channel in your server.',
			category: 'settings',
			usage: '<toggle|channel|message> <[<true>|<enable>]|channel ID|[<edit>|<default>]> <null|null|leave message>',
			aliases: ['leavechannel'],
			guildOnly: true,
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const [option, action, ...leaveMessage] = args;
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		await addCD();
		switch (option) {
			case 'toggle': {
				const choice: boolean = action.toLowerCase() === 'true' || action.toLowerCase() === 'enable';
				await this.cobalt.db.updateGuild(guildId, {
					leaveMessage: {
						message: guild.leaveMessage.message,
						channelId: guild.leaveMessage.channelId,
						enabled: choice,
					},
				});
				return message.channel.send({
					content: `Successfully ${choice === true ? 'enabled' : 'disabled'} the leave message`,
				});
			}
			case 'channel': {
				const channel = await this.cobalt.utils.findChannel(message, action);
				if (!channel)
					return message.reply({ content: "Didn't find the text channel. Please try again with a valid channel" });
				await this.cobalt.db.updateGuild(guildId, {
					leaveMessage: {
						message: guild.leaveMessage.message,
						channelId: channel.id,
						enabled: guild.leaveMessage.enabled,
					},
				});
				return message.channel.send({ content: `Successfully changed the leave channel to ${channel}` });
			}
			case 'message': {
				if (!action)
					return message.reply({
						content: `Do you want to edit or set the message to default?\nExample: \`${guild.prefix}setleavechannel message edit <leave message>\``,
					});
				if (action === 'edit') {
					await this.cobalt.db.updateGuild(guildId, {
						leaveMessage: {
							message: leaveMessage.join(' '),
							channelId: guild.leaveMessage.channelId,
							enabled: guild.leaveMessage.enabled,
						},
					});
					return message.channel.send({
						content: `Successfully changed the leave message to:\n\`${leaveMessage.join(' ')}\``,
					});
				}
				if (action === 'default') {
					await this.cobalt.db.updateGuild(guildId, {
						leaveMessage: {
							message: 'Goodbye {user.username}.',
							channelId: guild.leaveMessage.channelId,
							enabled: guild.leaveMessage.enabled,
						},
					});
					return message.channel.send({ content: `Successfully changed the leave message to default` });
				}
				break;
			}
			default: {
				return message.reply({ content: 'Please choose between `toggle, channel, or message`' });
			}
		}
	}
}

export default UpdateLeaveChannelCommand;
