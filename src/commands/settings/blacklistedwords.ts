import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class BlacklistedWordsCommand extends GenericCommand {
	constructor() {
		super({
			name: 'blacklistedwords',
			description: 'add, remove, or list blacklisted words in your server.',
			category: 'settings',
			usage: '<list|add|remove> [word]',
			aliases: ['filterword', 'filterwords', 'blw'],
			guildOnly: true,
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		addCD();
		const [option, item] = args;
		const guildId = message.guild?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) return message.reply({ content: 'An error occurred.' });
		const blacklistWords = guild?.blacklistedWords;

		switch (option) {
			case 'add': {
				if (blacklistWords?.includes(item))
					return message.channel.send({ content: 'word already exists in the list.' });
				if (blacklistWords === null || !blacklistWords) {
					await this.cobalt.db.updateGuild(guildId, {
						blacklistedWords: [item],
					});
				} else {
					await this.cobalt.db.updateGuild(guildId, {
						blacklistedWords: [...guild.blacklistedWords, item],
					});
				}
				return message.channel.send({ content: `${item} was added to the list of blacklisted words` });
			}
			case 'remove': {
				if (blacklistWords !== null) {
					if (!blacklistWords?.includes(item))
						return message.channel.send({ content: 'Word does not exist in the list' });
					const words = blacklistWords?.filter(w => w.toLowerCase() !== item.toLowerCase());
					await this.cobalt.db.updateGuild(guildId, { blacklistedWords: words });
					return message.channel.send({ content: `${item} was removed from the list of blacklisted words` });
				}
				return message.channel.send({ content: 'There are no blacklisted words yet.' });
			}
			case 'list': {
				const words = blacklistWords !== null && blacklistWords?.map(w => `\`${w}\``).join(', ');
				return message.channel.send({ content: words || 'There are no blacklisted words yet.' });
			}
			default: {
				return message.reply({ content: 'option does not exist.' });
			}
		}
	}
}

export default BlacklistedWordsCommand;
