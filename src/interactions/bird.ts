import { CommandInteraction, MessageEmbed } from "discord.js";
import Interaction from "../struct/Interaction";
import fetch from "node-fetch";

abstract class BirdInteraction extends Interaction {
    constructor() {
        super({
            name: "bird",
            descrition: "Returns an image of a bird"
        });
    };

    async run (interaction: CommandInteraction) {
        const data = await (await fetch("https://some-random-api.ml/img/birb")).json();
        const embed = new MessageEmbed().setImage(data.link);
        return interaction.reply(embed);
    };
};

export default BirdInteraction;