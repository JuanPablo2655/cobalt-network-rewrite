import { Message, MessageEmbed } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";

abstract class HelpCommand extends GenericCommand {
    constructor() {
        super({
            name: "help",
            description: "Help menu",
            category: "utility",
            aliases: ["h", "halp"]
        });
    };

    run(message: Message, args: string[], addCD: Function) {
        addCD();
        const helpEmbed = new MessageEmbed().setColor("RANDOM");
        const command = this.cobalt.commands.get(args[0]);
        const categories = this.removeDuplicates(this.cobalt.commands.map(c => c.category));
        if (!args && !command) {
            helpEmbed.setDescription(`${this.cobalt.user?.username} Command List`)
            for (const category of categories) {
                helpEmbed.addField(`${category}`, `\`${this.cobalt.prefix}help ${category}\``, true);
            };
            return message.channel.send(helpEmbed);
        } else if (categories.includes(args[0]) && !command) {
            const commandNames: Array<string> = new Array;
            const commands = this.cobalt.commands.filter(c => c.category === args[0]);
            for (const command of commands) {
                if (!commandNames.includes(command[1].name)) {
                    commandNames.push(command[1].name);
                };
            };
            helpEmbed.setDescription(`${args[0]} Commands`, `${commandNames.map(c => `\`${c}\``).join(", ")}`)
        };
    };

    removeDuplicates(array: Array <string | undefined> ) {
        return [...new Set(array)];
    };
};

export default HelpCommand;