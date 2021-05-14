import { Guild, Message, TextChannel } from "discord.js";
import Event from "../struct/Event"
import dotenv from "dotenv";
dotenv.config();

abstract class MessageEvent extends Event {
    constructor() {
        super({
            name: 'message'
        });
    };

    run(message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(this.cobalt.prefix)) {
            return; // handle xp and bank space
        };
        const args = message.content.slice(this.cobalt.prefix.length).trim().split(/ +/);
        const commandName: string | undefined = args.shift();
        if (commandName) {
            const command = this.cobalt.commands.get(commandName);
            if (command) {
                if (command.ownerOnly && !process.env.OWNERS?.split(",").includes(message.author.id)) {
                    return message.channel.send("This comamnd can only be used by the owners of the bot.");
                } else if (command.guildOnly && !(message.guild instanceof Guild)) {
                    return message.channel.send("This command can only be used in a guild.");
                };
                if (message.channel instanceof TextChannel) {
                    const userPermissions = command.userPermissions;
                    const clientPermissions = command.clientPermissions;
                    const missingPermissions = new Array;
                    if (userPermissions?.length) {
                        for (let i = 0; i < userPermissions.length; i++) {
                            const hasPermissions = message.member?.hasPermission(userPermissions[i]);
                            if (!hasPermissions) missingPermissions.push(userPermissions[i]);
                        };
                        if (missingPermissions.length) return message.channel.send(`Your missing these required permissions: ${missingPermissions.join(", ")}`);
                    };
                    if (clientPermissions?.length) {
                        for (let i = 0; i < clientPermissions.length; i++) {
                            const hasPermission = message.guild?.me?.hasPermission(clientPermissions[i]);
                            if (!hasPermission) missingPermissions.push(clientPermissions[i]);
                        };
                        if (missingPermissions.length) return message.channel.send(`I\'m missing these required permissions: ${missingPermissions.join(", ")}`);
                    };
                };
                try {
                    return command.run(message, args, addCD);
                } catch (err) {
                    console.error(err);
                    message.reply("there was an error running this command.");
                };
            };
        };
    };
};

export default MessageEvent;

function addCD() {
    throw new Error("Function not implemented.");
}
