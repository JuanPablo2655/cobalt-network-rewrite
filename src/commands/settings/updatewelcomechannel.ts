import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { resolveGuildTextChannel } from '#utils/resolvers';
import { createGuild, getGuild, updateGuild } from '#lib/database';

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
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Missing Guild');
		const guildId = message.guild.id;
		const guild = (await getGuild(guildId)) ?? (await createGuild(guildId));
		if (!guild) throw new Error('Missing guild database entry');
		await addCD();
		switch (option) {
			case 'toggle': {
				const choice: boolean = action.toLowerCase() === 'true' || action.toLowerCase() === 'enable';
				await updateGuild(guildId, {
					welcomeMessage: {
						enabled: choice,
					},
				});
				return message.channel.send({
					content: `Successfully ${choice === true ? 'enabled' : 'disabled'} the welcome message`,
				});
			}
			case 'channel': {
				const channel = await resolveGuildTextChannel(action, message.guild);
				if (!channel) throw new UserError({ identifier: Identifiers.ArgumentGuildChannelError }, 'Invalid channel');
				await updateGuild(guildId, {
					welcomeMessage: {
						channelId: channel.id,
					},
				});
				return message.channel.send({ content: `Successfully changed the welcome channel to ${channel}` });
			}
			case 'message': {
				if (!action)
					throw new UserError(
						{ identifier: Identifiers.ArgsMissing },
						`Do you want to edit or set the message to default?\nExample: \`${guild.prefix}setwelcomechannel message edit <welcome message>\``,
					);
				if (action === 'edit') {
					await updateGuild(guildId, {
						welcomeMessage: {
							message: welcomeMessage.join(' '),
						},
					});
					return message.channel.send({
						content: `Successfully changed the welcome message to:\n\`${welcomeMessage.join(' ')}\``,
					});
				}
				if (action === 'default') {
					await updateGuild(guildId, {
						welcomeMessage: {
							message: 'Welcome, {user.tag} to {guild.name}!',
						},
					});
					return message.channel.send({ content: `Successfully changed the welcome message to default` });
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

export default UpdateWelcomeChannelCommand;
