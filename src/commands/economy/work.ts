import type { Message } from 'discord.js';
import { jobs } from '#lib/data';
import { GenericCommand } from '#lib/structures/commands';
import { calcMulti } from '#utils/util';
import { minutes } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';
import { addMulti, formatNumber } from '#utils/functions';
import { addToWallet, getOrCreateUser } from '#lib/database';

abstract class WorkCommand extends GenericCommand {
	constructor() {
		super({
			name: 'work',
			description: 'Go to work if not you get fired.',
			category: 'economy',
			cooldown: minutes(10),
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		const user = await getOrCreateUser(message.author.id);
		if (!user) throw new Error('Missing user database entry');
		if (user.job === null)
			throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'You need a job to work.');
		await addCD();
		const job = jobs.find(j => j.id === user.job);
		if (!job) throw new Error('Invalid job id');
		const workEntry = job.entries[Math.floor(Math.random() * job.entries.length)];
		const money = Math.floor(job.minAmount + Math.random() * 250);
		const multi = await calcMulti(message.author, this.cobalt);
		const moneyEarned = addMulti(money, multi);
		await addToWallet(message.author.id, moneyEarned);
		const cleanEntry = workEntry
			?.replace(/{user.username}/g, message.author.username)
			.replace(/{money}/g, formatNumber(moneyEarned) ?? '0');
		return message.channel.send({ content: cleanEntry });
	}
}

export default WorkCommand;
