import { Message } from 'discord.js';
import jobs from '../../data/jobs';
import GenericCommand from '../../struct/GenericCommand';

abstract class ApplyJobCommand extends GenericCommand {
	constructor() {
		super({
			name: 'applyjob',
			description: 'Apply for a job you want.',
			category: 'economy',
			cooldown: 60,
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		addCD();
		const guild = await this.cobalt.db.getGuild(message.guild!.id);
		const user = await this.cobalt.db.getUser(message.author.id);
		if (!args[0])
			return message.reply(`Please provide a job id. You can find a list by running \`${guild?.prefix}listjobs\``);
		const job = jobs.find(j => j.id === args[0].toLowerCase());
		if (!job) return message.reply('Please pick a valid job with a valid job id to apply for.');
		if (user?.job === null) {
			await this.cobalt.econ.updateJob(message.author.id, job.id);
			return message.reply(
				`Congraduations on becoming a **${job.name}**. Your minimum payment is now **₡${this.cobalt.utils.formatNumber(
					job.minAmount,
				)}**`,
			);
		} else {
			return message.reply(`You have a job already. If you want to switch you have to quit your job`);
		}
	}
}

export default ApplyJobCommand;