import { Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";
import items from "../../data/items";

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
        const itemsList = items.filter(i => i.canBuy);
        if (!itemsList) return message.reply("nothing on the store");
        const itemNames: Array<string> = new Array;
        for (const item of itemsList) {
            itemNames.push(item.name);
        };
        return message.channel.send(itemNames.join(", "));
    };
};

export default TestCommand;