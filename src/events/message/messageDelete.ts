import { Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import Event from "../../struct/Event";

abstract class MessageDeleteEvent extends Event {
    constructor() {
        super({
            name: "messageDelete"
        });
    };

    async run(message: Message) {
        if (!this.cobalt.testEvents) return;
        if (!message.guild) return;
        if (!message.guild.available) return;
        const guild = await this.cobalt.db.getGuild(message.guild.id);
        if (!guild) return;
        if (!guild.logChannel.enabled) return;
        const logChannelId = guild.logChannel.channelId;
        const logChannel = this.cobalt.guilds.cache.get(message.guild.id)?.channels.cache.get(logChannelId as Snowflake) as TextChannel;
        const avatar = message.author.displayAvatarURL({ format: "png", dynamic: true });
        const logEmbed = new MessageEmbed()
            .setAuthor(message.author.username, avatar)
            .setTitle("Message Deleted")
            .setColor("#8f0a0a")
            .setFooter(`Message ID: ${message.id}`)
            .setTimestamp()
            .addField("Text Channel", `${message.channel}`)
            if (message.content == "") {
                logEmbed.setImage(await this.cobalt.utils.getImage(message)[0]);
            } else if (message.attachments.size === 0) {
                logEmbed.setDescription(`${message.content}`);
            } else {
                logEmbed.setDescription(`${message.content}`);
                logEmbed.setImage(await this.cobalt.utils.getImage(message)[0]);
            };
            logChannel.send({ embeds: [logEmbed] });
            return;
    };
};

export default MessageDeleteEvent;