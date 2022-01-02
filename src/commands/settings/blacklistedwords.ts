import { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';

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
		await addCD();
		const [option, item] = args;
		const guildId = message.guild?.id;
		const guild = await this.cobalt.db.getGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		const blacklistWords = guild.blacklistedWords;

		switch (option) {
			case 'add': {
				if (blacklistWords?.includes(item))
					throw new UserError(
						{ identifer: Identifiers.PreconditionDataExists },
						`\`${item}\` already exists in the list`,
					);
				// TODO(Isidro): refactor
				if (blacklistWords === null || !blacklistWords) {
					await this.cobalt.db.updateGuild(guildId, {
						blacklistedWords: [item],
					});
				} else {
					await this.cobalt.db.updateGuild(guildId, {
						blacklistedWords: [...(guild.blacklistedWords ?? []), item],
					});
				}
				return message.channel.send({ content: `${item} was added to the list of blacklisted words` });
			}
			case 'remove': {
				if (blacklistWords === null)
					throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'There are no blacklisted words yet');
				if (!blacklistWords?.includes(item))
					throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'Word does not exist in the list');
				const words = blacklistWords?.filter(w => w.toLowerCase() !== item.toLowerCase());
				await this.cobalt.db.updateGuild(guildId, { blacklistedWords: words });
				return message.channel.send({ content: `${item} was removed from the list of blacklisted words` });
			}
			case 'list': {
				const words = blacklistWords !== null && blacklistWords?.map(w => `\`${w}\``).join(', ');
				return message.channel.send({ content: words || 'There are no blacklisted words yet.' });
			}
			default: {
				throw new UserError({ identifer: Identifiers.ArgsMissing }, 'Invalid arg type');
			}
		}
	}
}

export default BlacklistedWordsCommand;
