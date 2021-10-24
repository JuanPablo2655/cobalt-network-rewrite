import { Message, MessageEmbed } from 'discord.js';
import jobs from '../../data/jobs';
import { GenericCommand } from '../../lib/structures/commands';

abstract class ListJobsCommand extends GenericCommand {
	constructor() {
		super({
			name: 'listjobs',
			description: 'Get a list of jobs you can apply for.',
			category: 'economy',
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		let joblists: string[] = new Array();
		jobs.forEach(job => {
			joblists.push(`\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
		});
		const jobEmbed = new MessageEmbed().setTitle(`Job Listing`).setDescription(`${joblists.join('\n')}`);
		message.channel.send({ embeds: [jobEmbed] });
	}
}

export default ListJobsCommand;
