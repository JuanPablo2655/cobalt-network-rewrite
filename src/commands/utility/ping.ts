import { Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";

abstract class PingCommand extends GenericCommand {
    constructor() {
        super({
            name: "ping",
            description: "Check the bot ping.",
            category: "utility",
            aliases: ["p"]
        });
    };

    async run (message: Message, _args: string[], addCD: Function) {
        addCD();
        const m = await message.reply("If you see this neck yourself #owned");
        const ping = (m.createdTimestamp - message.createdTimestamp);
        return m.edit(`Latency: ${ping}ms\nAPI Latency: ${Math.round(this.cobalt.ws.ping)}ms`)
    };
};

export default PingCommand;