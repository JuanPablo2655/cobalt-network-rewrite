import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

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

	async run(message: Message, args: string[], addCD: Function) {
		const bot = await this.cobalt.db.getBot(this.cobalt.user?.id);
		if (!bot) return message.channel.send('An error has occured');
		const tax = Number(args[0]);
		if (!args[0]) return message.reply('I need to update the tax rate, please input a number.');
		if (isNaN(tax)) return message.reply('Please I need a valid number');
		if (tax < 1.5) return message.reply('Tax must be greater than 1.5%');
		if (tax > 60) return message.reply("Can't tax users more than 60%");
		addCD();
		await this.cobalt.db.updateBot(this.cobalt.user?.id, { tax });
		message.channel.send(`The global tax rate is now **${this.cobalt.utils.formatNumber(tax)}%**`);
	}
}

export default UpdateTaxCommand;