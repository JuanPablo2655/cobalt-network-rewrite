import { exec } from "child_process";
import { Message, MessageReaction } from "discord.js";
import { inspect, promisify } from "util";
import GenericCommand from "../../struct/GenericCommand";

abstract class EvalCommand extends GenericCommand {
    constructor() {
        super({
            name: "eval",
            description: "Eval raw code. Be careful of people who might want to gain access to the bot though this command!",
            category: "dev",
            usage: "<code>",
            aliases: ["e"],
            devOnly: true
        });
    };

    async run (message: Message, args: string[], addCD: Function) {
        addCD();
        let evalued = "undefined";
        switch (args[0]?.toLowerCase() ?? "") {
            case "-a": {
                if (!args[1]) return message.channel.send("What do you want to evaluate?");
                try {
                    evalued = await eval('(async() => {\n' + args.slice(1).join(' ') + '\n})();');
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                };
                break;
            };
            case "-sh": {
                if (!args[1]) return message.channel.send("What should I run in the terminal?");
                evalued = args.slice(1).join(' ');
                try {
                    const { stdout, stderr } = await promisify(exec)(evalued);
                    if (!stdout && !stderr) return message.channel.send('I ran that but there\'s no nothing to show.');
                    if (stdout)
                        evalued = stdout;
                    if (stderr)
                        evalued = stderr;
                } catch (err) {
                    evalued = err.toString();
                };
                break;
            };
            default: {
                if (!args[0]) return message.channel.send('What do you wanna evaluate?');
                try {
                    evalued = await eval(args.join(' '));
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                };
                break;
            };
        };

        const msg = await message.channel.send({content: evalued.slice(0, 1950),
            code: args[0]?.toLowerCase() === "-sh" ? "sh" : "js"
        });

        try {
            await msg.react("🔨");
            await msg.awaitReactions((r, u) => r.emoji.name === '🔨' && u.id === message.author.id, { time: 20000, max: 1, errors: ['time'] });
            if (msg.deletable) await msg.delete();
        } catch {
            if (!msg.deleted) await msg.reactions.resolve("🔨" as unknown as MessageReaction)?.users.remove();
        };

    };
};

export default EvalCommand;