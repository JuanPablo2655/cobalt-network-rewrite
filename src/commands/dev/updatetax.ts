import { Message } from 'discord.js';
import { GenericCommand } from '../../lib/structures';
import { formatNumber } from '../../lib/utils/util';

abstract class UpdateTaxCommand extends GenericCommand {
	constructor() {
		super({
			name: 'updatetax',
			description: 'Update the tax rate for all the users who use the bot.',
			category: 'dev',
			usage: '<tax>',
			devOnly: true,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return message.channel.send({ content: 'An error has occured' });
		const tax = Number(args[0]);
		if (!args[0]) return message.reply({ content: 'I need to update the tax rate, please input a number.' });
		if (isNaN(tax)) return message.reply({ content: 'Please I need a valid number' });
		if (tax < 1.5) return message.reply({ content: 'Tax must be greater than 1.5%' });
		if (tax > 60) return message.reply({ content: "Can't tax users more than 60%" });
		await addCD();
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { tax });
		message.channel.send({ content: `The global tax rate is now **${formatNumber(tax)}%**` });
	}
}

export default UpdateTaxCommand;
