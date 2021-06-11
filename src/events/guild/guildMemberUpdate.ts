import { GuildMember, MessageEmbed, Role, Snowflake, TextChannel } from "discord.js";
import Event from "../../struct/Event";

abstract class GuildMemberUpdateEvent extends Event {
    constructor() {
        super({
            name: "guildMemberUpdate"
        });
    };

    async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!this.cobalt.testEvents) return;
        if (!oldMember.guild) return;
        if (!oldMember.guild.available) return;
        const guild = await this.cobalt.db.getGuild(newMember.guild.id);
        if (!guild) return;
        if (!guild.logChannel.enabled) return;
        const logChannelId = guild?.logChannel.channelId;
        const logChannel = this.cobalt.guilds.cache.get(newMember.guild.id)?.channels.cache.get(logChannelId as Snowflake) as TextChannel;
        const avatar = newMember.user.displayAvatarURL({ format: "png", dynamic: true });
        const logEmbed = new MessageEmbed()
            .setAuthor(newMember.user.username, avatar)
            .setFooter(`User ID: ${newMember.user.id}`)
            .setTimestamp();
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const addedRoles: Role[] = [];
            newMember.roles.cache.forEach((role) => {
                if (!oldMember.roles.cache.has(role.id)) addedRoles.push(role);
            });
            logEmbed.setTitle("Roles Update")
                .setColor("#2f7db1")
                .setDescription(`Role(s) Added: ${addedRoles.join(", ")}`);
            logChannel.send({ embed: logEmbed });
            return
        };
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            const removedRoles: Role[] = [];
            oldMember.roles.cache.forEach((role) => {
                if (!newMember.roles.cache.has(role.id)) removedRoles.push(role);
            });
            logEmbed.setTitle("Roles Update")
                .setColor("#2f7db1")
                .setDescription(`Role(s) Removed: ${removedRoles.join(", ")}`);
            logChannel.send({ embed: logEmbed });
            return
        };
        if (oldMember.nickname !== newMember.nickname) {
            const oldNick = oldMember.nickname || "None";
            const newNick = newMember.nickname || "None";
            logEmbed.setTitle(`Nickname Update`)
                .setColor("#2f7db1")
                .setDescription(`Old Nickname: **${oldNick}**\nNew Nickname: **${newNick}**`);
            logChannel.send({ embed: logEmbed });
            return
        };
    };
};

export default GuildMemberUpdateEvent;