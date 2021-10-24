import { Message } from 'discord.js';
import jobs from '../../data/jobs';
import { GenericCommand } from '../../lib/structures/commands';
import { addMulti, calcMulti, formatNumber } from '../../utils/util';

abstract class WorkCommand extends GenericCommand {
	constructor() {
		super({
			name: 'work',
			description: 'Go to work if not you get fired.',
			category: 'economy',
			cooldown: 60 * 10,
		});
	}

	async run(message: Message, _args: string[], addCD: () => Promise<void>) {
		const user = await this.cobalt.db.getUser(message.author.id);
		if (user?.job === null) return message.reply({ content: 'You need a job to work.' });
		await addCD();
		const job = jobs.find(j => j.id === user?.job);
		const workEntry = job?.entries[Math.floor(Math.random() * job?.entries.length)];
		const money = Math.floor(job!.minAmount + Math.random() * 250);
		const multi = await calcMulti(message.author, this.cobalt);
		const moneyEarned = addMulti(money, multi);
		await this.cobalt.econ.addToWallet(message.author.id, moneyEarned);
		const cleanEntry = workEntry
			?.replace(/{user.username}/g, message.author.username)
			.replace(/{money}/g, formatNumber(moneyEarned)!);
		return message.channel.send({ content: cleanEntry });
	}
}

export default WorkCommand;
