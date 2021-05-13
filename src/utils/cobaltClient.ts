import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { CommandOptions, EventOptions } from "../types/Options";
import Mongo from "./Mongo";
dotenv.config();

export class CobaltClient extends Client {
    public commands = new Collection<string, CommandOptions>();
    public cooldowns = new Collection<string, Collection<string, number>>();
    public aliases = new Collection<string, string>();
    public events = new Collection<string, EventOptions>();

    constructor() {
        super({
            ws: { intents: Intents.ALL },
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
        });
        
    };


    public start() {
        super.login(process.env.TOKEN);
        new Mongo(process.env.MONGOURL);
    };
};