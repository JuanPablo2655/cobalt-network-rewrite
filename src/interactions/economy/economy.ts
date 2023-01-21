/* eslint-disable sonarjs/no-nested-switch */
import type { ChatInputCommandInteraction } from 'discord.js';
import { economyCommand } from './options.js';
import { deposit, withdraw } from './subcommands/bank/index.js';
import { balance, daily, monthly, pay, weekly, work } from './subcommands/index.js';
import { apply, list, quit } from './subcommands/job/index.js';
import { InteractionCommand } from '#lib/structures';

abstract class EconomyInteractionCommand extends InteractionCommand {
	public constructor() {
		super({
			name: economyCommand.name,
			category: 'economy',
		});
	}

	public async run(interaction: ChatInputCommandInteraction<'cached'>) {
		const command = interaction.options.getSubcommand(true);
		switch (command) {
			case 'work': {
				await work(this.cobalt, interaction);
				break;
			}

			case 'pay': {
				await pay(this.cobalt, interaction);
				break;
			}

			case 'balance': {
				await balance(this.cobalt, interaction);
				break;
			}

			case 'daily': {
				await daily(this.cobalt, interaction);
				break;
			}

			case 'weekly': {
				await weekly(this.cobalt, interaction);
				break;
			}

			case 'monthly': {
				await monthly(this.cobalt, interaction);
				break;
			}

			default: {
				const group = interaction.options.getSubcommandGroup(true);
				switch (group) {
					case 'bank': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'deposit': {
								await deposit(this.cobalt, interaction);
								break;
							}

							case 'withdraw': {
								await withdraw(this.cobalt, interaction);
								break;
							}

							default:
								break;
						}

						break;
					}

					case 'job': {
						const command = interaction.options.getSubcommand(true);
						switch (command) {
							case 'apply': {
								await apply(this.cobalt, interaction);
								break;
							}

							case 'quit': {
								await quit(this.cobalt, interaction);
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

					default:
						break;
				}

				break;
			}
		}
	}
}

export default EconomyInteractionCommand;
