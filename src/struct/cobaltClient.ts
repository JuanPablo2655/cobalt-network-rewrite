import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { CommandRegistry, EventRegistry } from "./registries/export/RegistryIndex";
import { CommandOptions, EventOptions, InteractionCommandOptions } from "../types/Options";
import Util from "../utils/Util";
dotenv.config();

export class CobaltClient extends Client {
    public commands = new Collection<string, CommandOptions>();
    public cooldowns = new Collection<string, Collection<string, number>>();
    public aliases = new Collection<string, string>();
    public events = new Collection<string, EventOptions>();
    public interactions = new Collection<string, InteractionCommandOptions>();
    public prefix: string;
    public utils: Util;

    constructor() {
        super({
            intents: Intents.ALL,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
            allowedMentions: { repliedUser: false }
        });

        this.prefix = 't!!';
        this.utils = new Util(this);
    };


    public start() {
        CommandRegistry(this);
        EventRegistry(this);
        super.login(process.env.TOKEN);
    };
};