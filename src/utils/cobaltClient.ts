import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { CommandRegistry, EventRegistry } from "../struct/registries/export/RegistryIndex";
import { CommandOptions, EventOptions } from "../types/Options";
dotenv.config();

export class CobaltClient extends Client {
    public commands = new Collection<string, CommandOptions>();
    public cooldowns = new Collection<string, Collection<string, number>>();
    public aliases = new Collection<string, string>();
    public events = new Collection<string, EventOptions>();
    public prefix: string;

    constructor() {
        super({
            ws: { intents: Intents.ALL },
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
        });

        this.prefix = 'cn!';
    };


    public start() {
        CommandRegistry(this);
        EventRegistry(this);
        super.login(process.env.TOKEN);
    };
};