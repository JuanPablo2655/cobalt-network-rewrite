import { Message } from "discord.js";
import jobs from "../../data/jobs";
import GenericCommand from "../../struct/GenericCommand";

abstract class ListJobsCommand extends GenericCommand {
    constructor() {
        super({
            name: "listjobs",
            description: "Get a list of jobs you can apply for.",
            category: "economy"
        });
    };

    async run(message: Message, args: string[], addCD: Function) {
        let jobIds: string[] = new Array();
        const jobList = jobs.forEach(job => {
            jobIds.push(job.id)
        });
        
    };
};

export default ListJobsCommand;