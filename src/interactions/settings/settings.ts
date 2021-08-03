import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';
import { settingOptions } from './options';

abstract class settingsInteraction extends Interaction {
	constructor() {
		super({
			name: 'settings',
			descrition: 'Update your server settings.',
			options: settingOptions,
		});
	}

	async run(interaction: CommandInteraction) {
		const group = interaction.options.getSubcommandGroup(true);
		switch (group) {
			case 'blacklistword': {
				const command = interaction.options.getSubcommand(true);
				switch (command) {
					case 'add': {
						return interaction.reply({ content: 'blacklistword add' });
					}
					case 'remove': {
						return interaction.reply({ content: 'blacklistword remove' });
					}
					default:
						break;
				}
				break;
			}
			case 'leavechannel': {
				const command = interaction.options.getSubcommand(true);
				switch (command) {
					case 'message': {
						return interaction.reply({ content: 'leavechannel message' });
					}
					case 'channel': {
						return interaction.reply({ content: 'leavechannel channel' });
					}
					case 'toggle': {
						return interaction.reply({ content: 'leavechannel toggle' });
					}
					default:
						break;
				}
				break;
			}
			case 'logchannel': {
				const command = interaction.options.getSubcommand(true);
				switch (command) {
					case 'message': {
						return interaction.reply({ content: 'logchannel message' });
					}
					case 'channel': {
						return interaction.reply({ content: 'logchannel channel' });
					}
					case 'toggle': {
						return interaction.reply({ content: 'logchannel toggle' });
					}
					default:
						break;
				}
				break;
			}
			default:
				const command = interaction.options.getSubcommand(true);
				switch (command) {
					case 'category': {
						return interaction.reply({ content: 'category' });
					}
					case 'command': {
						return interaction.reply({ content: 'command' });
					}
					case 'event': {
						return interaction.reply({ content: 'event' });
					}
					default:
						break;
				}
				break;
		}
	}
}

export default settingsInteraction;
