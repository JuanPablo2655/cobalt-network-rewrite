import { GuildMember, MessageEmbed, Role, Snowflake, TextChannel } from "discord.js";
import Event from "../../struct/Event";

abstract class GuildMemberRoleRemoveEvent extends Event {
    constructor() {
        super({
            name: "guildMemberRoleRemove",
            once: true
        });
    };

    async run (member: GuildMember, role: Role) {
        if (!member.guild) return;
        if (!member.guild.available) return;
        // const user = await this.cobalt.db.getUser(member.user.id, member.guild.id);
        const guild = await this.cobalt.db.getGuild(member.guild.id);
        if (!guild) return;
        if (!guild.logChannel.enabled) return;
        const logChannelId = guild?.logChannel.channelId;
        const logChannel = this.cobalt.guilds.cache.get(member.guild.id)?.channels.cache.get(logChannelId as Snowflake) as TextChannel;
        const avatar = member.user.displayAvatarURL({ format: "png", dynamic: true });
        // if (user!.roles.length !== 0) {
        //     await this.cobalt.db.updateUser(member.user.id, member.guild.id, {
        //         roles: user!.roles.filter(r => r !== role.id),
        //     });
        // }

        const logEmbed = new MessageEmbed()
            .setAuthor(member.user.username, avatar)
            .setTitle(`Roles Update`)
            .setColor("#2f7db1")
            .setDescription(`Role Removed: **${role.name}**`)
            .setFooter(`User ID: ${member.user.id}`)
            .setTimestamp();
        logChannel.send(logEmbed);
    };
};

export default GuildMemberRoleRemoveEvent;