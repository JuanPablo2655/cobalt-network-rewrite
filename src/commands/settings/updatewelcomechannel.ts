import { Guild, Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";

abstract class UpdateWelcomeChannelCommand extends GenericCommand {
    constructor() {
        super({
            name: "setwelcomechannel",
            description: "Set the weclome channel.",
            category: "settings",
            aliases: ["swc"],
            guildOnly: true
        });
    };

    async run (message: Message, args: string[], addCD: Function) {
        const [chnl, ...welcomeMessage] = args;
        const channel = await this.cobalt.utils.findChannel(message, chnl);
        if (!channel) return message.reply("Didn't find the text channel. Please try again with a valid channel");
        const guildId = (message.guild as Guild)?.id;
        const guild = await this.cobalt.db.getGuild(guildId);
        if (!guild) return message.reply("An error has occured. Please report it the developer");
        addCD();
        await this.cobalt.db.updateGuild(guildId, {
            welcomeMessage: { message: welcomeMessage.join(" "), channelId: channel.id, enabled: guild.welcomeMessage.enabled }
        });
        return message.channel.send(`Successfully changed the welcome channel to ${channel}`);
    };
};

export default UpdateWelcomeChannelCommand;