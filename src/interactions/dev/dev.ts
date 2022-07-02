import { ApplicationCommandPermissionType, ChatInputCommandInteraction } from 'discord.js';
import { InteractionCommand } from '#lib/structures/commands';
import { devCommand } from './options.js';
import { pay, reboot } from './subcommands/index.js';
import { directors, tax } from './subcommands/update/index.js';

abstract class PingInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: devCommand.name,
			category: 'dev',
			permissions: [
				{
					id: '288703114473635841',
					type: ApplicationCommandPermissionType.User,
					permission: true,
				},
			],
		});
	}

	async run(interaction: ChatInputCommandInteraction<'cached'>) {
		const command = interaction.options.getSubcommand(true);
		switch (command) {
			case 'reboot': {
				await reboot(this.cobalt, interaction);
				break;
			}
			case 'pay': {
				await pay(this.cobalt, interaction);
				break;
			}
			default: {
				const group = interaction.options.getSubcommandGroup(true);
				switch (group) {
					case 'update': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'directors': {
								await directors(this.cobalt, interaction);
								break;
							}
							case 'tax': {
								await tax(this.cobalt, interaction);
								break;
							}
							default:
								break;
						}
						break;
					}
					default:
						break;
				}
				break;
			}
		}
	}
}

export default PingInteractionCommand;
