import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { formatNumber } from '#utils/functions';
import { getOrCreateBot, updateBot } from '#lib/database';

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
		if (!this.cobalt.user) throw new Error('Missing user');
		const bot = await getOrCreateBot(this.cobalt.user.id);
		if (!bot) throw new Error('Missing bot user');
		const tax = Number(args[0]);
		if (!args[0]) throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Missing number');
		if (isNaN(tax)) throw new UserError({ identifier: Identifiers.ArgumentNumberError }, 'Invalid number');
		if (tax < 1.5)
			throw new UserError({ identifier: Identifiers.ArgumentNumberTooSmall }, 'Tax must be greater than 1.5%');
		if (tax > 60)
			throw new UserError({ identifier: Identifiers.ArgumentNumberTooLarge }, "Tax can't be greater than 60%");
		await addCD();
		await updateBot(this.cobalt.user.id, { tax });
		message.channel.send({ content: `The global tax rate is now **${formatNumber(tax)}%**` });
	}
}

export default UpdateTaxCommand;
