import { MessageEmbed, Snowflake, WebhookClient } from "discord.js";
import Event from "../../struct/Event";

abstract class ShardReadyEvent extends Event {
    constructor() {
        super({
            name: "shardReady"
        });
    };

    async run(id: number, unavailableGuilds: Set<string>) {
        if (!this.cobalt.testEvents) return;
        const cobaltHook = new WebhookClient("841886640682958909" as Snowflake, "Ncp5ATyT9qvZTXPfNxlQ9L6Si-Sfp2BljzbCUrleoAIuBAtIyP1EORJefEXMmCkU79XS");
        const shardEmbed = new MessageEmbed()
            .setTitle(`Shard Ready`)
            .setTimestamp();
            if (!unavailableGuilds) {
                shardEmbed.setDescription(`Shard \`${id}\` is connected!`);
            } else {
                shardEmbed.setDescription(`Shard \`${id}\` is connected!\n\nThe following guilds are unavailable due to a server outage:\n\`\`\`\n${Array.from(unavailableGuilds).join('\n')}\n\`\`\``);
            };
        cobaltHook.send({ embeds: [shardEmbed] });
    };
};

export default ShardReadyEvent;