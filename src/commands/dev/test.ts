import { Message, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
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
        const btn = new MessageButton()
            .setCustomID("test")
            .setLabel("test")
            .setStyle("PRIMARY");
        const row = new MessageActionRow().addComponents(btn);
        await message.channel.send({ content: "button", components: [row] });
        const filter = (i: MessageComponentInteraction) => i.customID === 'test';
        const collector = message.createMessageComponentInteractionCollector(filter, { time: 3000 });
        collector.on("collect", async i => {
            if (i.customID === "test") {
                await i.update({ content: `${message.author.username} clicked the button!`, components: [row] });
            };
        });
        // collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    };
};

export default TestCommand;