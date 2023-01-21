import { type Message, type TextChannel, EmbedBuilder } from 'discord.js';
import { getOrCreateGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { getImage } from '#utils/util';

abstract class MessageDeleteListener extends Listener {
	public constructor() {
		super({
			name: 'messageDelete',
		});
	}

	public async run(message: Message) {
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!this.cobalt.testListeners) return;
		if (!message.author) return;
		if (!message.guild) return;
		if (!message.guild.available) return;
		const guild = await getOrCreateGuild(message.guild.id);
		if (!guild) return;
		if (!guild.log?.enabled) return;
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = this.cobalt.guilds.cache.get(message.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = message.author.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: message.author.username, iconURL: avatar })
			.setTitle('Message Deleted')
			.setColor('#8f0a0a')
			.setFooter({ text: `Message ID: ${message.id}` })
			.setTimestamp()
			.addFields([{ name: 'Text Channel', value: `${message.channel}` }]);
		if (message.content === '') {
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
