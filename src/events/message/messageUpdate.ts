import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '#lib/structures/events';
import { getDiff, getImage } from '#utils/util';

abstract class MessageUpdateEvent extends Event {
	constructor() {
		super({
			name: 'messageUpdate',
		});
	}

	async run(oldMessage: Message, newMessage: Message) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (!oldMessage.author) return;
		if (oldMessage === newMessage || newMessage.author.bot) return;
		if (!newMessage.guild) return;
		if (!newMessage.guild.available) return;
		const guild = await this.cobalt.db.getGuild(newMessage.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache
			.get(newMessage.guild.id)
			?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newMessage.author.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor(newMessage.author.username, avatar)
			.setTitle('Message Update')
			.setColor('#2f7db1');
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
			logEmbed.setFooter(`Message ID: ${newMessage.id}`).setTimestamp();
			return void logChannel.send({ embeds: [logEmbed] });
		}
	}
}

export default MessageUpdateEvent;
