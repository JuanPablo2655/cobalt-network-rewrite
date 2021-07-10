import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class QuitJobCommand extends GenericCommand {
	constructor() {
		super({
			name: 'quitjob',
			description: "You know maybe minimum wage isn't the best.",
			category: 'economy',
			cooldown: 60,
		});
	}

	async run(message: Message, _args: string[], addCD: Function) {
		addCD();
		const user = await this.cobalt.db.getUser(message.author.id);
		if (user?.job === null) return message.reply({ content: `You don't have a job to quit from.` });
		await this.cobalt.econ.updateJob(message.author.id, null);
		return message.channel.send({
			content: `You have successfully quit from your current job. You need to apply to a new job if you want to work.`,
		});
	}
}

export default QuitJobCommand;
