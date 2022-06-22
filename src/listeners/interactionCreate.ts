import { ChatInputCommandInteraction, GuildMember, Interaction, PermissionsString, TextChannel } from 'discord.js';
import { Listener } from '#lib/structures/listeners';
import { logger } from '#lib/structures';
import { isOwner } from '#utils/functions';

abstract class InteractionListener extends Listener {
	constructor() {
		super({
			name: 'interactionCreate',
		});
	}

	async run(interaction: Interaction<'cached'>) {
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.inCachedGuild()) return;

		const command = this.cobalt.container.interactions.get(interaction.commandName);
		if (command) {
			const guild = await this.cobalt.container.db.getGuild(interaction.guild.id);
			if (guild) {
				if (guild?.disabledCategories?.includes(command.category)) return;
				if (guild?.disabledCommands?.includes(command.name)) return;
				if (command.devOnly && !this.isDev(interaction)) {
					return;
				}
				if (interaction.channel instanceof TextChannel) {
					const userPermissions = command.userPermissions;
					const clientPermissions = command.clientPermissions;
					const missingPermissions = new Array<PermissionsString>();
					if (userPermissions?.length) {
						for (let i = 0; i < userPermissions.length; i++) {
							const hasPermissions = interaction.channel
								.permissionsFor(interaction.member as GuildMember)
								?.has(userPermissions[i]);
							if (!hasPermissions) missingPermissions.push(userPermissions[i]);
						}
						if (missingPermissions.length)
							interaction.reply({
								content: `Your missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								ephemeral: true,
							});
						return;
					}
					if (clientPermissions?.length) {
						for (let i = 0; i < clientPermissions.length; i++) {
							const hasPermission = interaction.guild?.members.me?.permissions.has(clientPermissions[i]);
							if (!hasPermission) missingPermissions.push(clientPermissions[i]);
						}
						if (missingPermissions.length)
							interaction.reply({
								content: `I'm missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								ephemeral: true,
							});
						return;
					}
				}
			}
			try {
				await command.run(interaction);
				logger.info(`Interaction triggered by ${interaction.user.tag}`);
			} catch (err) {
				const error = err as Error;
				logger.error(error, error.message);
				try {
					if (!interaction.deferred && !interaction.replied) {
						logger.warn(
							{ interaction: { name: interaction.commandName, type: interaction.type }, userId: interaction.user.id },
							'Command interaction has not been deffered before throwing',
						);
						await interaction.deferReply();
					}
					await interaction.editReply({ content: error.message, components: [] });
				} catch (err) {
					const error = err as Error;
					logger.error(error, error.message);
				}
			}
		}
	}

	isDev(inteaction: ChatInputCommandInteraction<'cached'>) {
		return isOwner(inteaction.member as GuildMember);
	}
}

export default InteractionListener;
