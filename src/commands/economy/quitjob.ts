import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { minutes } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { createUser, getUser, updateJob } from '#lib/database';

abstract class QuitJobCommand extends GenericCommand {
	constructor() {
		super({
			name: 'quitjob',
			description: "You know maybe minimum wage isn't the best.",
			category: 'economy',
			cooldown: minutes(1),
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		await addCD();
		const user = (await getUser(message.author.id)) ?? (await createUser(message.author.id));
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
