import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { CommandRegistry, EventRegistry } from "./registries/export/RegistryIndex";
import { CommandOptions, EventOptions, InteractionCommandOptions } from "../typings/Options";
import Util from "../utils/Util";
import Database from "../utils/Database";
dotenv.config();

export class CobaltClient extends Client {
    public commands = new Collection<string, CommandOptions>();
    public cooldowns = new Collection<string, Collection<string, number>>();
    // public aliases = new Collection<string, CommandOptions>();
    public events = new Collection<string, EventOptions>();
    public interactions = new Collection<string, InteractionCommandOptions>();
    public devMode: boolean;
    public testEvents: boolean;
    public utils: Util;
    public db: Database;

    constructor() {
        super({
            intents: Intents.ALL,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
            allowedMentions: { repliedUser: false }
        });

        this.devMode = process.env.DEVMODE === "true" ? true : false;
        this.testEvents = process.env.TESTEVENTS === "true" ? true : false;
        this.utils = new Util(this);
        this.db = new Database(this);
    };


    public start() {
        CommandRegistry(this);
        EventRegistry(this);
        super.login(process.env.TOKEN);
    };
};