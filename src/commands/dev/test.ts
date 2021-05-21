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

    async run(message: Message, args: string[], addCD: Function) {
        addCD();
        const member = await this.cobalt.utils.findMember(message, args, { allowAuthor: true });
        const role = await this.cobalt.utils.findRole(message, args[1]);
        if(!role || !args[1]) return message.channel.send("Didn't find the role :(")
        if (!member) return message.channel.send("Didn't find the member :(");
        return message.channel.send(`${member?.user?.tag} ${role.name}`);
    };
};

export default TestCommand;