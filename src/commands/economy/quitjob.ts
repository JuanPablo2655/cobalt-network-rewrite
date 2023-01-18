import type { Message } from 'discord.js';
import { getOrCreateUser, updateJob } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { minutes } from '#utils/common';

abstract class QuitJobCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'quitjob',
			description: "You know maybe minimum wage isn't the best.",
			category: 'economy',
			cooldown: minutes(1),
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		const user = await getOrCreateUser(message.author.id);
		if (!user) throw new Error('Missing user database entry');
		if (user.job === null)
			throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `You don't have a job to quit from`);
		await updateJob(message.author.id, null);
		return message.channel.send({
			content: `You have successfully quit from your current job. You need to apply to a new job if you want to work.`,
		});
	}
}

export default QuitJobCommand;
