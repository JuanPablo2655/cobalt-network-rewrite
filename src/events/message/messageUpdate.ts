import { Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import Event from "../../struct/Event";

abstract class MessageUpdateEvent extends Event {
    constructor() {
        super({
            name: "messageUpdate"
        });
    };

    async run(oldMessage: Message, newMessage: Message) {
        if (oldMessage === newMessage || newMessage.author.bot) return;
        if (!newMessage.guild) return;
        if (!newMessage.guild.available) return;
        const guild = await this.cobalt.db.getGuild(newMessage.guild.id);
        if (!guild) return;
        if(!guild.logChannel.enabled) return;
        const logChannelId = guild.logChannel.channelId;
        const logChannel = this.cobalt.guilds.cache.get(newMessage.guild.id)?.channels.cache.get(logChannelId as Snowflake) as TextChannel;
        const avatar = newMessage.author.displayAvatarURL({ format: "png", dynamic: true });
        const logEmbed = new MessageEmbed()
            .setAuthor(newMessage.author.username, avatar)
            .setTitle("Message Update")
            .setColor("#2f7db1")
            if (newMessage.content == "") {
                logEmbed.setImage(await this.cobalt.utils.getImage(newMessage)[0]);
            } else if (newMessage.attachments.size === 0) {
                logEmbed.setDescription(`[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})\n${this.cobalt.utils.getDiff(oldMessage.content, newMessage.content)}`)
            } else {
                logEmbed.setDescription(`[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})\n${this.cobalt.utils.getDiff(oldMessage.content, newMessage.content)}`)
                logEmbed.setImage(await this.cobalt.utils.getImage(newMessage)[0]);
            }
            logEmbed.setFooter(`Message ID: ${newMessage.id}`)
            .setTimestamp()
        logChannel.send({ embed: logEmbed });
        return
    };
};

export default MessageUpdateEvent;