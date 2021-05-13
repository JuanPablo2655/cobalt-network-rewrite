import { Message, PermissionString } from "discord.js";
import { CommandType } from "../types/Options";

abstract class GenericCommand {
    public name: String;
    public description: String;
    public category: String;
    public usage?: String;
    public aliases?: string[];
    public enabled: Boolean;
    public ownerOnly?: boolean;
    public guildOnly?: boolean;
    public nsfwOnly?: boolean;
    public cooldown?: Number;
    public userPermissions?: PermissionString[];
    public clientPermissions?: PermissionString[];

    constructor(options: CommandType) {
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.usage = options.usage ?? 'No usage provided';
        this.aliases = options.aliases ?? [];
        this.enabled = options.enabled ?? true;
        this.ownerOnly = options.ownerOnly ?? false;
        this.guildOnly = options.guildOnly ?? false;
        this.nsfwOnly = options.nsfwOnly ?? false;
        this.cooldown = options.cooldown ?? 1;
        this.userPermissions = options.userPermissions ?? [];
        this.clientPermissions = options.clientPermissions ?? [];
    };

    public abstract run(message: Message, args: string[]): unknown | Promise<unknown>;
};

export default GenericCommand;