import type { Message } from 'discord.js';
import { jobs } from '#lib/data';
import { addToWallet, getOrCreateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { minutes } from '#utils/common';
import { addMulti, formatNumber } from '#utils/functions';
import { calcMulti } from '#utils/util';

abstract class WorkCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'work',
			description: 'Go to work if not you get fired.',
			category: 'economy',
			cooldown: minutes(10),
		});
	}

	public async run(message: Message, _args: string[], addCD: () => Promise<void>) {
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
			?.replaceAll('{user.username}', message.author.username)
			.replaceAll('{money}', formatNumber(moneyEarned) ?? '0');
		return message.channel.send({ content: cleanEntry });
	}
}

export default WorkCommand;
