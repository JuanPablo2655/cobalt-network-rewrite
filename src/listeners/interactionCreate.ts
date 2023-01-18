import {
	type ChatInputCommandInteraction,
	type GuildMember,
	type Interaction,
	type PermissionsString,
	TextChannel,
} from 'discord.js';
import { getOrCreateGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { container } from '#root/Container';
import { isOwner } from '#utils/functions';

const { interactions } = container;

abstract class InteractionListener extends Listener {
	public constructor() {
		super({
			name: 'interactionCreate',
		});
	}

	public async run(interaction: Interaction<'cached'>) {
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.inCachedGuild()) return;
		const command = interactions.get(interaction.commandName);
		if (command) {
			const guild = await getOrCreateGuild(interaction.guild.id);
			if (guild) {
				if (guild.disabledCategories.includes(command.category)) return;
				if (guild.disabledCommands.includes(command.name)) return;
				if (command.devOnly && !this.isDev(interaction)) {
					return;
				}

				if (interaction.channel instanceof TextChannel) {
					const userPermissions = command.userPermissions;
					const clientPermissions = command.clientPermissions;
					const missingPermissions = new Array<PermissionsString>();
					if (userPermissions?.length) {
						for (const userPermission of userPermissions) {
							const hasPermissions = interaction.channel
								.permissionsFor(interaction.member as GuildMember)
								?.has(userPermission);
							if (!hasPermissions) missingPermissions.push(userPermission);
						}

						if (missingPermissions.length)
							await interaction.reply({
								content: `Your missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								ephemeral: true,
							});
						return;
					}

					if (clientPermissions?.length) {
						for (const clientPermission of clientPermissions) {
							const hasPermission = interaction.guild.members.me?.permissions.has(clientPermission);
							if (!hasPermission) missingPermissions.push(clientPermission);
						}

						if (missingPermissions.length)
							await interaction.reply({
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
			} catch (error_) {
				const error = error_ as Error;
				logger.error(error, error.message);
				try {
					if (!interaction.deferred && !interaction.replied) {
						logger.warn(
							{ interaction: { name: interaction.commandName, type: interaction.type }, userId: interaction.user.id },
							'Command interaction has not been deferred before throwing',
						);
						await interaction.deferReply();
					}

					await interaction.editReply({ content: error.message, components: [] });
				} catch (error_) {
					const error = error_ as Error;
					logger.error(error, error.message);
				}
			}
		}
	}

	private isDev(interaction: ChatInputCommandInteraction<'cached'>) {
		return isOwner(interaction.member);
	}
}

export default InteractionListener;
