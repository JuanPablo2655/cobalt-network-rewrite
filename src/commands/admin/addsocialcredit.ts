import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { findMember, formatNumber } from '#utils/util';

abstract class addSocialCredit extends GenericCommand {
	constructor() {
		super({
			name: 'addsocialcredit',
			description: 'Add social credit to someone outstanding.',
			category: 'admin',
			usage: '<user> <amount>',
			cooldown: 5,
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const member = await findMember(this.cobalt, message, args);
		if (!member) return message.reply({ content: 'Please give me a valid user!' });
		if (member.id == message.author.id) return message.reply({ content: "can't give yourself social credit" });
		const amount = Number(args[1]);
		if (isNaN(amount)) return message.reply({ content: 'Please give a valid number!' });
		addCD();
		const userData = await this.cobalt.db.getUser(member.id);
		const newAmount = (userData?.socialCredit ?? 0) + amount;
		if (newAmount > 2000) return message.reply({ content: 'The max social credit someone can have is 2,000!' });
		this.cobalt.db.updateUser(member.id, { socialCredit: newAmount });
		message.channel.send({ content: `${member.user.username} social credit score is now ${formatNumber(newAmount)}!` });
	}
}

export default addSocialCredit;
