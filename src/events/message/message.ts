import { Collection, Guild, Message, TextChannel, Permissions } from "discord.js";
import Event from "../../struct/Event"
import dotenv from "dotenv";
dotenv.config();

abstract class MessageEvent extends Event {
    constructor() {
        super({
            name: 'message'
        });
    };

    async run(message: Message) {
        const guild = await this.cobalt.db.getGuild(message?.guild?.id);

        const escapeRegex = (str?: string) => str?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixReg = new RegExp(`^(<@!?${this.cobalt?.user?.id}>|${escapeRegex(guild?.prefix)})\\s*`);
        const prefixArr = message.content.match(prefixReg);
        const prefix = prefixArr?.[0];
        if (message.author.bot) return;
        if (!message.member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && !message.author.bot) {        
            let hasBadWord = false;
            let badWords: string[] = [];
            guild?.blacklistedWords.forEach((word) => {
                message.content.split(" ").forEach((messageWord) => {
                    if (word.toLowerCase() === messageWord.toLowerCase()) {
                        badWords.push(word);
                        return (hasBadWord = true);
                    };
                });
            });
            if (hasBadWord) {
                message.deletable && message.delete();
                const user = this.cobalt.users.cache.get(message.author.id);
                user?.send(`The word(s) \`${badWords.join(", ")}\` is banned, please watch your language.`);
                return;
            };
        };
        if (!prefix) return;
        if (!message.content.toLowerCase().startsWith(prefix)) {
            return; // handle xp and bank space
        };
        const args = message.content.slice(prefix?.length).trim().split(/ +/);
        const commandName: string | undefined = args.shift();
        if (message.mentions.members?.has(this.cobalt.user!.id) && !commandName) message.channel.send(`My prefix is \`${guild?.prefix}\``)
        if (commandName) {
            const command = this.cobalt.commands.get(commandName);
            if (command) {
                if (!guild?.verified && command.name !== "verify") message.channel.send("You have to verify your server with one of the Directors in the main server!");
                if (guild?.disabledCategories?.includes(command.category)) return
                if (guild?.disabledCommands?.includes(command.name)) return
                if (command.devOnly && !process.env.OWNERS?.split(",").includes(message.author.id)) {
                    return
                } else if (command.ownerOnly && (message.guild as Guild).ownerID !== message.author.id) {
                    message.reply("This comamnd can only be used by the owner of the guild.");
                    return;
                } else if (command.guildOnly && !(message.guild instanceof Guild)) {
                    message.reply("This command can only be used in a guild.");
                    return;
                } else if (command.nsfwOnly && !(message.channel as TextChannel).nsfw) {
                    message.reply("This command can only be used in a NSFW marked channel.");
                    return;
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
                        if (missingPermissions.length) message.reply({ content: `Your missing these required permissions: ${missingPermissions.map(p => `\`${p}\``).join(", ")}`, allowedMentions: { repliedUser: true }});
                    };
                    if (clientPermissions?.length) {
                        for (let i = 0; i < clientPermissions.length; i++) {
                            const hasPermission = message.guild?.me?.permissions.has(clientPermissions[i]);
                            if (!hasPermission) missingPermissions.push(clientPermissions[i]);
                        };
                        if (missingPermissions.length) message.reply({ content: `I\'m missing these required permissions: ${missingPermissions.map(p => `\`${p}\``).join(", ")}`, allowedMentions: { repliedUser: true }});
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
                    const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
                    bot!.totalCommandsUsed += 1
                    await bot?.save();
                    command.run(message, args, updateCooldown);
                    return;
                } catch (err) {
                    console.error(err);
                    message.reply("there was an error running this command.");
                };
            };
        };
    };
};

export default MessageEvent;