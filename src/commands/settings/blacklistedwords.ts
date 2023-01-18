import type { Message } from 'discord.js';
import { GenericCommand } from '#lib/structures/commands';
import { Identifiers, UserError } from '#lib/errors';
import { getOrCreateGuild, updateGuild } from '#lib/database';

abstract class BlacklistedWordsCommand extends GenericCommand {
	constructor() {
		super({
			name: 'blacklistedwords',
			description: 'add, remove, or list blacklisted words in your server.',
			category: 'settings',
			usage: '<list|add|remove> [word]',
			aliases: ['filterword', 'filterwords', 'blw'],
			guildOnly: true,
			userPermissions: ['ManageGuild'],
		});
	}

	async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		if (!message.guild) return;
		const [option, item] = args;
		const guildId = message.guild.id;
		const guild = await getOrCreateGuild(guildId);
		if (!guild) throw new Error('Missing guild database entry');
		const { blacklistedWords } = guild;

		switch (option) {
			case 'add': {
				if (blacklistedWords?.includes(item))
					throw new UserError(
						{ identifier: Identifiers.PreconditionDataExists },
						`\`${item}\` already exists in the list`,
					);
				await updateGuild(guildId, {
					blacklistedWords: [...guild.blacklistedWords, item],
				});
				return message.channel.send({ content: `${item} was added to the list of blacklisted words` });
			}
			case 'remove': {
				if (blacklistedWords === null)
					throw new UserError(
						{ identifier: Identifiers.PreconditionMissingData },
						'There are no blacklisted words yet',
					);
				if (!blacklistedWords?.includes(item))
					throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'Word does not exist in the list');
				const words = blacklistedWords?.filter(w => w.toLowerCase() !== item.toLowerCase());
				await updateGuild(guildId, { blacklistedWords: words });
				return message.channel.send({ content: `${item} was removed from the list of blacklisted words` });
			}
			case 'list': {
				const words = blacklistedWords !== null && blacklistedWords?.map(w => `\`${w}\``).join(', ');
				return message.channel.send({ content: words || 'There are no blacklisted words yet.' });
			}
			default: {
				throw new UserError({ identifier: Identifiers.ArgsMissing }, 'Invalid arg type');
			}
		}
	}
}

export default BlacklistedWordsCommand;
