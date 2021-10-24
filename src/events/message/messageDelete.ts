import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../../lib/structures/events';
import { getImage } from '../../lib/utils/util';

abstract class MessageDeleteEvent extends Event {
	constructor() {
		super({
			name: 'messageDelete',
		});
	}

	async run(message: Message) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (!message.author) return;
		if (!message.guild) return;
		if (!message.guild.available) return;
		const guild = await this.cobalt.db.getGuild(message.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		const logChannelId = guild.logChannel.channelId;
		const logChannel = this.cobalt.guilds.cache.get(message.guild.id)?.channels.cache.get(logChannelId!) as TextChannel;
		const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor(message.author.username, avatar)
			.setTitle('Message Deleted')
			.setColor('#8f0a0a')
			.setFooter(`Message ID: ${message.id}`)
			.setTimestamp()
			.addField('Text Channel', `${message.channel}`);
		if (message.content == '') {
			logEmbed.setImage(getImage(message)[0]);
		} else if (message.attachments.size === 0) {
			logEmbed.setDescription(`${message.content}`);
		} else {
			logEmbed.setDescription(`${message.content}`);
			logEmbed.setImage(getImage(message)[0]);
		}
		return void logChannel.send({ embeds: [logEmbed] });
	}
}

export default MessageDeleteEvent;
