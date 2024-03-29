import { type Message, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { getOrCreateGuild } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import { container } from '#root/Container';
import { removeDuplicates, toCapitalize } from '#utils/functions';

const { commands: _commands } = container;

abstract class HelpCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'help',
			description: 'Get the a list of all the commands available.',
			category: 'utility',
			usage: '[category | command]',
			aliases: ['h', 'halp'],
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		// TODO(Isidro): refactor help command
		await addCD();
		if (!message.guild) throw new UserError({ identifier: Identifiers.PreconditionGuildOnly }, 'Guild only command');
		const guild = await getOrCreateGuild(message.guild.id);
		const command = _commands.get(args[0]);
		const categories = removeDuplicates(_commands.map(c => c.category as string));
		if (command) {
			const usage = command.usage ? `${command.name} ${command.usage}` : `${command.name}`;
			const helpEmbed = new EmbedBuilder().setColor('Random');
			helpEmbed.setTitle(`${command.name} Info`).addFields([
				{ name: 'Description:', value: `${command.description}` },
				{ name: 'Usage:', value: `${guild.prefix}${usage}` },
				{ name: 'Aliases:', value: `${command.aliases?.length ? command.aliases.join(', ') : 'None'}` },
				{ name: 'Cooldown:', value: `${prettyMilliseconds((command.cooldown || 1) * 1_000)}` },
				{ name: 'Perms Needed:', value: `${command.clientPermissions?.map(p => `\`${p}\``).join(', ')}` },
			]);
			return message.reply({ embeds: [helpEmbed] });
		} else if (categories.includes(args[0])) {
			const helpEmbed = new EmbedBuilder().setColor('Random');
			const commandNames: string[] = new Array<string>();
			const commands = _commands.filter(c => c.category === args[0]);
			for (const command of commands) {
				if (!commandNames.includes(command[1].name)) {
					commandNames.push(command[1].name);
				}
			}

			helpEmbed.setTitle(`${toCapitalize(args[0])} Commands`);
			helpEmbed.setDescription(`${commandNames.map(c => `\`${c}\``).join(', ')}`);
			return message.reply({ embeds: [helpEmbed] });
		} else {
			const helpEmbed = new EmbedBuilder().setColor('Random');
			helpEmbed.setDescription(`${this.cobalt.user?.username} Command List`);
			for (const category of categories) {
				if (category === 'dev') continue;
				helpEmbed.addFields([
					{ name: `${toCapitalize(category)}`, value: `\`${guild.prefix}help ${category}\``, inline: true },
				]);
			}

			return message.reply({ embeds: [helpEmbed] });
		}
	}
}

export default HelpCommand;
