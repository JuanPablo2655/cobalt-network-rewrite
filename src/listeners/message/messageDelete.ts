import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { getImage } from '#utils/util';

abstract class MessageDeleteListener extends Listener {
	constructor() {
		super({
			name: 'messageDelete',
		});
	}

	async run(message: Message) {
		if (!this.cobalt.testListeners) return;
		if (!message.author) return;
		if (!message.guild) return;
		if (!message.guild.available) return;
		const guild = await this.cobalt.db.getGuild(message.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(message.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor({ name: message.author.username, iconURL: avatar })
			.setTitle('Message Deleted')
			.setColor('#8f0a0a')
			.setFooter({ text: `Message ID: ${message.id}` })
			.setTimestamp()
			.addField('Text Channel', `${message.channel}`);
		if (message.content == '') {
			logEmbed.setImage(getImage(message)!);
		} else if (message.attachments.size === 0) {
			logEmbed.setDescription(`${message.content}`);
		} else {
			logEmbed.setDescription(`${message.content}`);
			logEmbed.setImage(getImage(message)!);
		}
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default MessageDeleteListener;
