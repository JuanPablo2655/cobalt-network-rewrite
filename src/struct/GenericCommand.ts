import { Message, PermissionString } from "discord.js";
import { CommandType } from "../types/Options";
import { CobaltClient } from "../utils/cobaltClient";

abstract class GenericCommand {
    public name: string;
    public description: string;
    public category: string;
    public usage: string;
    public aliases: string[];
    public enabled: boolean;
    public ownerOnly: boolean;
    public guildOnly: boolean;
    public nsfwOnly: boolean;
    public cooldown: number;
    public userPermissions: PermissionString[];
    public clientPermissions: PermissionString[];
    public abstract cobalt: CobaltClient;

    constructor(options: CommandType) {
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.usage = `${options.name} ${options.usage}` ?? `${options.name}`;
        this.aliases = options.aliases ?? [];
        this.enabled = options.enabled ?? true;
        this.ownerOnly = options.ownerOnly ?? false;
        this.guildOnly = options.guildOnly ?? false;
        this.nsfwOnly = options.nsfwOnly ?? false;
        this.cooldown = options.cooldown ?? 1;
        this.userPermissions = options.userPermissions ?? [];
        this.clientPermissions = options.clientPermissions ?? [];
    };

    public abstract run(message: Message, args: string[], addCD: Function): unknown | Promise<unknown>;
};

export default GenericCommand;