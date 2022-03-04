import { Message, MessageEmbed } from 'discord.js';
import { jobs } from '#lib/data';
import { GenericCommand } from '#lib/structures/commands';

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
		const joblists = jobs.map(job => `\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
		const jobEmbed = new MessageEmbed().setTitle(`Job Listing`).setDescription(`${joblists.join('\n')}`);
		message.channel.send({ embeds: [jobEmbed] });
	}
}

export default ListJobsCommand;
