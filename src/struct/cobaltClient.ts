import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { CommandRegistry, EventRegistry } from './registries/export/RegistryIndex';
import { CommandOptions, EventOptions, InteractionCommandOptions } from '../typings/Options';
import Util from '../utils/Util';
import Database from '../utils/Database';
import Experience from '../utils/Experience';
import Economy from '../utils/Economy';
dotenv.config();

export class CobaltClient extends Client {
	public commands = new Collection<string, CommandOptions>();
	public cooldowns = new Collection<string, Collection<string, number>>();
	public events = new Collection<string, EventOptions>();
	public interactions = new Collection<string, InteractionCommandOptions>();
	public devMode: boolean;
	public testEvents: boolean;
	public disableXp: boolean;
	public utils: Util;
	public db: Database;
	public exp: Experience;
	public econ: Economy;

	constructor() {
		super({
			intents: Intents.ALL,
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
			allowedMentions: { repliedUser: false },
		});

		this.devMode = process.env.DEVMODE === 'true' ? true : false;
		this.testEvents = process.env.TESTEVENTS === 'true' ? true : false;
		this.disableXp = process.env.DISABLEXP === 'true' ? true : false;
		this.utils = new Util(this);
		this.db = new Database(this);
		this.exp = new Experience(this);
		this.econ = new Economy(this);
	}

	public start() {
		CommandRegistry(this);
		EventRegistry(this);
		super.login(process.env.TOKEN);
	}
}
