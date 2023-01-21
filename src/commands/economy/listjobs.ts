import { type Message, EmbedBuilder } from 'discord.js';
import { jobs } from '#lib/data';
import { GenericCommand } from '#lib/structures';

abstract class ListJobsCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'listjobs',
			description: 'Get a list of jobs you can apply for.',
			category: 'economy',
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		const jobLists = jobs.map(job => `\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
		const jobEmbed = new EmbedBuilder().setTitle(`Job Listing`).setDescription(`${jobLists.join('\n')}`);
		await message.channel.send({ embeds: [jobEmbed] });
	}
}

export default ListJobsCommand;
