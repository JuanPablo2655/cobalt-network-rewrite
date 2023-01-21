/* eslint-disable sonarjs/no-nested-switch */
import type { ChatInputCommandInteraction } from 'discord.js';
import { settingCommand } from './options.js';
import { add, list, remove } from './subcommands/blacklistword/index.js';
import * as leavechannel from './subcommands/leavechannel/index.js';
import * as logchannel from './subcommands/logchannel/index.js';
import * as welcomechannel from './subcommands/welcomechannel/index.js';
import { InteractionCommand } from '#lib/structures';

abstract class settingsInteractionCommand extends InteractionCommand {
	public constructor() {
		super({
			name: settingCommand.name,
			category: 'settings',
		});
	}

	public async run(interaction: ChatInputCommandInteraction<'cached'>) {
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

			default: {
				const group = interaction.options.getSubcommandGroup(true);
				switch (group) {
					case 'blacklistword': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'add': {
								await add(this.cobalt, interaction);
								break;
							}

							case 'remove': {
								await remove(this.cobalt, interaction);
								break;
							}

							case 'list': {
								await list(this.cobalt, interaction);
								break;
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
								await leavechannel.message(this.cobalt, interaction);
								break;
							}

							case 'channel': {
								await leavechannel.channel(this.cobalt, interaction);
								break;
							}

							case 'toggle': {
								await leavechannel.toggle(this.cobalt, interaction);
								break;
							}

							default:
								break;
						}

						break;
					}

					case 'welcomechannel': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'message': {
								await welcomechannel.message(this.cobalt, interaction);
								break;
							}

							case 'channel': {
								await welcomechannel.channel(this.cobalt, interaction);
								break;
							}

							case 'toggle': {
								await welcomechannel.toggle(this.cobalt, interaction);
								break;
							}

							default:
								break;
						}

						break;
					}

					case 'logchannel': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'channel': {
								await logchannel.channel(this.cobalt, interaction);
								break;
							}

							case 'toggle': {
								await logchannel.toggle(this.cobalt, interaction);
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

export default settingsInteractionCommand;
