import { Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";

abstract class PingCommand extends GenericCommand {
    constructor() {
        super({
            name: "ping",
            description: "check the bot ping",
            category: "util",
            aliases: ["p"]
        });
    };

    run (message: Message, _args: string[], addCD: Function) {
        addCD();
        return message.channel.send("ping")
    };
};

export default PingCommand;