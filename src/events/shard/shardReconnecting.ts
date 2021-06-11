import { MessageEmbed, Snowflake, WebhookClient } from "discord.js";
import Event from "../../struct/Event";

abstract class ShardReconnectingEvent extends Event {
    constructor() {
        super({
            name: "shardReconnecting"
        });
    };

    async run(id: number) {
        if (!this.cobalt.testEvents) return;
        const cobaltHook = new WebhookClient("841886640682958909" as Snowflake, "Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS");
        const shardEmbed = new MessageEmbed()
            .setTitle(`Shard Reconnecting`)
            .setDescription(`Shard \`${id}\` is reconnecting!`)
            .setTimestamp();
        cobaltHook.send({ embeds: [shardEmbed] });
    };
};

export default ShardReconnectingEvent;