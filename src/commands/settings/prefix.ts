import { Message } from 'discord.js';
import GenericCommand from '../../struct/GenericCommand';

abstract class PrefixCommand extends GenericCommand {
	constructor() {
		super({
			name: 'prefix',
			description: 'Change the prefix for the server.',
			category: 'settings',
			guildOnly: true,
			userPermissions: ['MANAGE_GUILD'],
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		addCD();
		const guild = await this.cobalt.db.getGuild(message.guild?.id);
		const prefix = args[0];
		if (!prefix)
			return message.reply(
				`Current server prefix is ${guild?.prefix}.\nUse ${guild?.prefix}prefix <prefix> to set a new prefix.`,
			);

		await this.cobalt.db.updateGuild(message.guild?.id, { prefix });
		return message.channel.send(`Successfully changed the prefix to \`${prefix}\`.`);
	}
}

export default PrefixCommand;
