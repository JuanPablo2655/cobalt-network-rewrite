import { Message, EmbedBuilder, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { getImage } from '#utils/util';
import { logger } from '#lib/structures';
import { getDiff } from '#utils/functions';
import { createGuild, getGuild } from '#lib/database';

abstract class MessageUpdateListener extends Listener {
	constructor() {
		super({
			name: 'messageUpdate',
		});
	}

	async run(oldMessage: Message, newMessage: Message) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!oldMessage.author) return;
		if (oldMessage === newMessage || newMessage.author.bot) return;
		if (!newMessage.guild) return;
		if (!newMessage.guild.available) return;
		const guild = (await getGuild(newMessage.guild.id)) ?? (await createGuild(newMessage.guild.id));
		if (!guild) return;
		if (!guild.log?.enabled) return;
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache
			.get(newMessage.guild.id)
			?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newMessage.author.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: newMessage.author.username, iconURL: avatar })
			.setTitle('Message Update')
			.setColor('#2f7db1')
			.setFooter({ text: `Message ID: ${newMessage.id}` })
			.setTimestamp();
		if (oldMessage.content !== newMessage.content) {
			if (newMessage.content == '') {
				logEmbed.setImage(getImage(newMessage)!);
			} else if (newMessage.attachments.size === 0) {
				logEmbed.setDescription(
					`[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${
						newMessage.id
					})\n${getDiff(oldMessage.content, newMessage.content)}`,
				);
			} else {
				logEmbed.setDescription(
					`[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${
						newMessage.id
					})\n${getDiff(oldMessage.content, newMessage.content)}`,
				);
				logEmbed.setImage(getImage(newMessage)!);
			}
			return void logChannel.send({ embeds: [logEmbed] });
		}
	}
}

export default MessageUpdateListener;
