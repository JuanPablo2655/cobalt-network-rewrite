import { Guild, Message } from 'discord.js';
import { GenericCommand } from '../../lib/structures';
import { findChannel } from '../../lib/utils/util';

abstract class UpdateWelcomeChannelCommand extends GenericCommand {
	constructor() {
		super({
			name: 'setwelcomechannel',
			description: 'Set the weclome channel.',
			category: 'settings',
			usage: '',
			aliases: ['swc'],
			guildOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const [option, action, ...welcomeMessage] = args;
		const guildId = (message.guild as Guild)?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error has occured. Please report it the developer' });
		await addCD();
		switch (option) {
			case 'toggle': {
				const choice: boolean = action.toLowerCase() === 'true' || action.toLowerCase() === 'enable';
				await this.cobalt.db.updateGuild(guildId, {
					welcomeMessage: {
						message: guild.welcomeMessage?.message ?? null,
						channelId: guild.welcomeMessage?.channelId ?? null,
						enabled: choice,
					},
				});
				return message.channel.send({
					content: `Successfully ${choice === true ? 'enabled' : 'disabled'} the welcome message`,
				});
			}
			case 'channel': {
				const channel = await findChannel(message, action);
				if (!channel)
					return message.reply({ content: "Didn't find the text channel. Please try again with a valid channel" });
				await this.cobalt.db.updateGuild(guildId, {
					welcomeMessage: {
						message: guild.welcomeMessage?.message ?? null,
						channelId: channel.id,
						enabled: guild.welcomeMessage?.enabled ?? true,
					},
				});
				return message.channel.send({ content: `Successfully changed the welcome channel to ${channel}` });
			}
			case 'message': {
				if (!action)
					return message.reply({
						content: `Do you want to edit or set the message to default?\nExample: \`${guild.prefix}setwelcomechannel message edit <welcome message>\``,
					});
				if (action === 'edit') {
					await this.cobalt.db.updateGuild(guildId, {
						welcomeMessage: {
							message: welcomeMessage.join(' '),
							channelId: guild.welcomeMessage?.channelId ?? null,
							enabled: guild.welcomeMessage?.enabled ?? true,
						},
					});
					return message.channel.send({
						content: `Successfully changed the welcome message to:\n\`${welcomeMessage.join(' ')}\``,
					});
				}
				if (action === 'default') {
					await this.cobalt.db.updateGuild(guildId, {
						welcomeMessage: {
							message: 'Welcome, {user.tag} to {guild.name}!',
							channelId: guild.welcomeMessage?.channelId ?? null,
							enabled: guild.welcomeMessage?.enabled ?? true,
						},
					});
					return message.channel.send({ content: `Successfully changed the welcome message to default` });
				}
				break;
			}
			default: {
				return message.reply({ content: 'Please choose between `toggle, channel, or message`' });
			}
		}
	}
}

export default UpdateWelcomeChannelCommand;
