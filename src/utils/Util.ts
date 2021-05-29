import { CobaltClient } from "../struct/cobaltClient";
import * as DJS from "discord.js";

export default class Util {
    cobalt: CobaltClient;
    constructor (cobalt: CobaltClient) {
        this.cobalt = cobalt;
    };

    formatNumber(n: string): string {
        let x = n.split(".");
        let x1 = x[0];
        let x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) x1 = x1.replace(rgx, "$1"+","+"$2");
        return x1 + x2;
        // return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    toCapitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    async findMember(message: Partial<DJS.Message>, args: string[], options?: { allowAuthor?: boolean, index?: number }): Promise<DJS.GuildMember | undefined | null> {
        if (!(message.guild instanceof DJS.Guild)) return;

        try {
            let member: DJS.GuildMember | undefined | null;
            const arg = args[options?.index ?? 0]?.replace?.(/[<@!>]/gi, "") || args[options?.index ?? 0];
            const mention = message.mentions?.users.first()?.id !== this.cobalt.user?.id ? message.mentions?.users.first() : message.mentions?.users.array()[1];

            member = 
                message.guild.members.cache.find((m) => m.user.id === mention?.id) ||
                message.guild.members.cache.get(arg) ||
                message.guild.members.cache.find((m) => m.user.id === args[options?.index ?? 0]) ||
                message.guild.members.cache.find((m) => m.user.username === args[options?.index ?? 0] || m.user.username.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase())) ||
                message.guild.members.cache.find((m) => m.displayName === args[options?.index ?? 0] || m.displayName.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase())) ||
                (message.guild.members.cache.find((m) => m.user.tag === args[options?.index ?? 0] || m.user.tag.toLowerCase().includes(args[options?.index ?? 0]?.toLowerCase())) as DJS.GuildMember) ||
                (options?.allowAuthor === true ? message.member : null);
            return member;
        } catch (err) {
            if (err?.includes?.("DiscordAPIError: Unknown Member")) return undefined;
            console.error(err);
        };
    };

    async findRole(message: DJS.Message, arg: string): Promise<DJS.Role | null> {
        if (!(message.guild instanceof DJS.Guild)) return null;
        return (
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(arg) ||
            message.guild.roles.cache.find((r) => r.name === arg) ||
            message.guild.roles.cache.find((r) => r.name.startsWith(arg)) ||
            message.guild.roles.fetch(arg)
        );
    };

    async findChannel(message: DJS.Message, arg: string): Promise<DJS.TextChannel | null> {
        if (!(message.guild instanceof DJS.Guild)) return null;
        return (
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(arg) ||
            message.guild.channels.cache.find((c) => (c as DJS.TextChannel).name === arg) ||
            message.guild.channels.cache.find((c) => (c as DJS.TextChannel).name.startsWith(arg))
        ) as DJS.TextChannel;
    };

    async trim(str: string, max: number) {
        return (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
    };
};