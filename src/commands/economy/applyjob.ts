import { Message } from 'discord.js';
import jobs from '../../data/jobs';
import { GenericCommand } from '../../lib/structures/commands';
import { formatMoney } from '../../utils/util';

abstract class ApplyJobCommand extends GenericCommand {
	constructor() {
		super({
			name: 'applyjob',
			description: 'Apply for a job you want.',
			category: 'economy',
			cooldown: 60,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		const guild = await this.cobalt.db.getGuild(message.guild!.id);
		const user = await this.cobalt.db.getUser(message.author.id);
		if (!args[0])
			return message.reply({
				content: `Please provide a job id. You can find a list by running \`${guild?.prefix}listjobs\``,
			});
		const job = jobs.find(j => j.id === args[0].toLowerCase());
		if (!job) return message.reply({ content: 'Please pick a valid job with a valid job id to apply for.' });
		if (user?.job === null) {
			await this.cobalt.econ.updateJob(message.author.id, job.id);
			return message.reply({
				content: `Congraduations on becoming a **${job.name}**. Your minimum payment is now **${formatMoney(
					job.minAmount,
				)}**`,
			});
		} else {
			return message.reply({ content: `You have a job already. If you want to switch you have to quit your job` });
		}
	}
}

export default ApplyJobCommand;
