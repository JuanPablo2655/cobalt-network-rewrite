import { Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";

abstract class TestCommand extends GenericCommand {
    constructor() {
        super({
            name: "test",
            description: "Test comamnd for the bot when testing new features.",
            category: "dev",
            ownerOnly: true
        });
    };

    async run(message: Message, _args: string[], addCD: Function) {
        addCD();
        return message.channel.send(">>> works?\ntest\ntest")
    };
};

export default TestCommand;