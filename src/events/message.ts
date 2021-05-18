import { Collection, Guild, Message, TextChannel } from "discord.js";
import Event from "../struct/Event"
import dotenv from "dotenv";
dotenv.config();

abstract class MessageEvent extends Event {
    constructor() {
        super({
            name: 'message'
        });
    };

    run(message: Message) {
        if (message.author.bot) return;
        if (!message.content.toLowerCase().startsWith(this.cobalt.prefix)) {
            return; // handle xp and bank space
        };
        const args = message.content.slice(this.cobalt.prefix.length).trim().split(/ +/);
        const commandName: string | undefined = args.shift();
        if (commandName) {
            const command = this.cobalt.commands.get(commandName);
            if (command) {
                if (command.ownerOnly && !process.env.OWNERS?.split(",").includes(message.author.id)) {
                    return message.channel.send("This comamnd can only be used by the owners of the bot.");
                } else if (command.guildOnly && !(message.guild instanceof Guild)) {
                    return message.channel.send("This command can only be used in a guild.");
                } else if (command.nsfwOnly && !(message.channel as TextChannel).nsfw) {
                    return message.channel.send("This command can only be used in a NSFW marked channel.")
                };
                if (message.channel instanceof TextChannel) {
                    const userPermissions = command.userPermissions;
                    const clientPermissions = command.clientPermissions;
                    const missingPermissions = new Array;
                    if (userPermissions?.length) {
                        for (let i = 0; i < userPermissions.length; i++) {
                            const hasPermissions = message.member?.permissions.has(userPermissions[i]);
                            if (!hasPermissions) missingPermissions.push(userPermissions[i]);
                        };
                        if (missingPermissions.length) return message.reply(`Your missing these required permissions: ${missingPermissions.map(p => `\`${p}\``).join(", ")}`, { allowedMentions: { repliedUser: true }});
                    };
                    if (clientPermissions?.length) {
                        for (let i = 0; i < clientPermissions.length; i++) {
                            const hasPermission = message.guild?.me?.permissions.has(clientPermissions[i]);
                            if (!hasPermission) missingPermissions.push(clientPermissions[i]);
                        };
                        if (missingPermissions.length) return message.reply(`I\'m missing these required permissions: ${missingPermissions.map(p => `\`${p}\``).join(", ")}`, { allowedMentions: { repliedUser: true }});
                    };
                };
                const updateCooldown = () => {
                    if (command.cooldown) {
                        if (!this.cobalt.cooldowns.has(command.name)) {
                            this.cobalt.cooldowns.set(command.name, new Collection());
                        };
                        const now = Date.now();
                        const timestamps = this.cobalt.cooldowns.get(command.name);
                        const cooldownAmount = command.cooldown * 1000;
                        if (timestamps?.has(message.author.id)) {
                            const cooldown = timestamps.get(message.author.id);
                            if (cooldown) {
                                const expirationTime = cooldown + cooldownAmount;
                                if (now < expirationTime) {
                                    return
                                };                            
                            };
                        };
                        timestamps?.set(message.author.id, now);
                        setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);
                    };
                };
                const isInCooldown = (): boolean => {
                    if (command.cooldown) {
                        const now = Date.now();
                        const timestamps = this.cobalt.cooldowns.get(command.name);
                        const cooldownAmount = command.cooldown * 1000;
                        if (!timestamps) return false;
                        if (timestamps?.has(message.author.id)) {
                            const cooldown = timestamps.get(message.author.id);
                            if (cooldown) {
                                const expirationTime = cooldown + cooldownAmount;
                                if (now < expirationTime) {
                                    const timeLeft = (expirationTime - now) / 1000;
                                    message.channel.send(`Wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${command.name}\` command.`);
                                    return true;
                                };
                            };
                        };
                        return false;
                    };
                    return false;
                };
                try {
                    if (isInCooldown()) return
                    return command.run(message, args, updateCooldown);
                } catch (err) {
                    console.error(err);
                    message.reply("there was an error running this command.");
                };
            };
        };
    };
};

export default MessageEvent;