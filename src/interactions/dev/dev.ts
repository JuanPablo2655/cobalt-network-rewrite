import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';
import { devOptions } from './options';
import { pay, reboot } from './subcommands';
import { directors, tax } from './subcommands/update';

abstract class PingInteraction extends Interaction {
	constructor() {
		super({
			name: 'dev',
			descrition: 'dev only commands',
			category: 'dev',
			options: devOptions,
			permissions: [
				{
					id: '288703114473635841',
					type: 'USER',
					permission: true,
				},
			],
			defaultPermission: false,
		});
	}

	async run(interaction: CommandInteraction) {
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
			default:
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

export default PingInteraction;
