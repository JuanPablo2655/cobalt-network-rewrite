import { GuildMember, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import Event from "../../struct/Event";

abstract class GuildMemberNicknameUpdateEvent extends Event {
    constructor() {
        super({
            name: "guildMemberNicknameUpdate"
        });
    };

    async run (member: GuildMember, oldNickname: string, newNickname: string) {
        if (!member.guild) return;
        if (!member.guild.available) return;
        const guild = await this.cobalt.db.getGuild(member.guild.id);
        if (!guild) return;
        if (!guild.logChannel.enabled) return;
        const logChannelId = guild?.logChannel.channelId;
        const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId as Snowflake) as TextChannel;
        const avatar = member.user.displayAvatarURL({ format: "png", dynamic: true })
        const oldNick = oldNickname || "None";
        const newNick = newNickname || "None";

        const logEmbed = new MessageEmbed()
            .setAuthor(member.user.username, avatar)
            .setTitle(`Nickname Update`)
            .setColor("#2f7db1")
            .setDescription(`Old Nickname: **${oldNick}**\nNew Nickname: **${newNick}**`)
            .setFooter(`User ID: ${member.user.id}`)
            .setTimestamp();
        logChannel.send(logEmbed);
    };
};

export default GuildMemberNicknameUpdateEvent;