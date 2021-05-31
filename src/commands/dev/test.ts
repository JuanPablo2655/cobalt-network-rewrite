import { Message } from "discord.js";
import GenericCommand from "../../struct/GenericCommand";
import jobs from "../../data/jobs"

abstract class TestCommand extends GenericCommand {
    constructor() {
        super({
            name: "test",
            description: "Test comamnd for the bot when testing new features.",
            category: "dev",
            ownerOnly: true
        });
    };

    async run(message: Message, _args: string[], addCD: Function) {
        addCD();
        const job = jobs.find((j) => j.id === "constructionworker");
        if (!job) return message.reply("Job not found");
        const jobEntry = job.entries[Math.floor(Math.random() * job.entries.length)].replace("{user.username}", message.author.username).replace("{money}", this.cobalt.utils.formatNumber(String(job.minAmount)));
        return message.channel.send(jobEntry);
    };
};

export default TestCommand;