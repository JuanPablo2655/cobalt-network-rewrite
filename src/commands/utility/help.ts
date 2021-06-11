import { Message, MessageEmbed } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import GenericCommand from "../../struct/GenericCommand";

abstract class HelpCommand extends GenericCommand {
    constructor() {
        super({
            name: "help",
            description: "Get the a list of all the commands avaliable.",
            category: "utility",
            usage: "[category | command]",
            aliases: ["h", "halp"]
        });
    };

    async run(message: Message, args: string[], addCD: Function) {
        addCD();
        const guild = await this.cobalt.db.getGuild(message.guild?.id)
        const command = this.cobalt.commands.get(args[0]);
        const categories = this.removeDuplicates(this.cobalt.commands.map(c => c.category));
        if (command) {
            const usage = command.usage ? `${command.name} ${command.usage}` : `${command.name}`
            const helpEmbed = new MessageEmbed().setColor("RANDOM");
            helpEmbed.setDescription(`${command.name} Info`)
                .addField("Description:", `${command.description}`)
                .addField("Usage:", `\`${guild?.prefix}${usage}\``)
                .addField("Aliases:", `${command.aliases?.length ? command.aliases.join(", ") : "None"}`)
                .addField("Cooldown:", `${prettyMilliseconds((command.cooldown || 1) * 1000)}`)
                .addField("Perms Needed:", `${command.clientPermissions?.map(p => `\`${p}\``).join(", ")}`);
            return message.reply({ embed: helpEmbed });
        } else if (categories.includes(args[0])) {
            const helpEmbed = new MessageEmbed().setColor("RANDOM");
            const commandNames: Array<string> = new Array;
            const commands = this.cobalt.commands.filter(c => c.category === args[0]);
            for (const command of commands) {
                if (!commandNames.includes(command[1].name)) {
                    commandNames.push(command[1].name);
                };
            };
            helpEmbed.setTitle(`${this.cobalt.utils.toCapitalize(args[0])} Commands`);
            helpEmbed.setDescription(`${commandNames.map(c => `\`${c}\``).join(", ")}`);
            return message.reply({ embed: helpEmbed });
        } else {
            const helpEmbed = new MessageEmbed().setColor("RANDOM");
            helpEmbed.setDescription(`${this.cobalt.user?.username} Command List`);
            for (const category of categories) {
                helpEmbed.addField(`${this.cobalt.utils.toCapitalize(category)}`, `\`${guild?.prefix}help ${category}\``, true);
            };
            return message.reply({ embed: helpEmbed });
        };
    };

    removeDuplicates(array: Array <string> ) {
        return [...new Set(array)];
    };
};

export default HelpCommand;