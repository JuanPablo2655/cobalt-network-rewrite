import type { Message } from 'discord.js';
import { jobs } from '#lib/data';
import { updateJob, getOrCreateUser, getOrCreateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { minutes } from '#utils/common';
import { formatMoney } from '#utils/functions';

abstract class ApplyJobCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'applyjob',
			description: 'Apply for a job you want.',
			category: 'economy',
			cooldown: minutes(1),
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		if (!message.guild) return;
		const guild = await getOrCreateGuild(message.guild.id);
		const user = await getOrCreateUser(message.author.id);
		if (!user) throw new Error('Database error');
		if (!args[0])
			throw new UserError(
				{ identifier: Identifiers.ArgsMissing },
				`Please provide a job id. You can find a list by running \`${
					guild?.prefix ?? this.cobalt.user?.username
				}listjobs\``,
			);
		const job = jobs.find(job => job.id === args[0].toLowerCase());
		if (!job)
			throw new UserError(
				{ identifier: Identifiers.PreconditionMissingData },
				'Please pick a valid job with a valid job id to apply for',
			);
		if (user.job !== null)
			throw new UserError(
				{ identifier: Identifiers.PreconditionDataExists },
				'You have a job already. If you want to switch, you have to quit your job',
			);

		await updateJob(message.author.id, job.id);
		return message.reply({
			content: `Congratulations on becoming a **${job.name}**. Your minimum payment is now **${formatMoney(
				job.minAmount,
			)}**`,
		});
	}
}

export default ApplyJobCommand;
