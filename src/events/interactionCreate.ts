import { CommandInteraction, GuildMember, Interaction, TextChannel } from 'discord.js';
import { Event } from '../lib/structures/events';

abstract class InteractionEvent extends Event {
	constructor() {
		super({
			name: 'interactionCreate',
		});
	}

	async run(interaction: Interaction) {
		this.cobalt.metrics.eventInc(this.name);
		if (!interaction.isCommand()) return;

		const command = this.cobalt.interactions.get(interaction.commandName);
		if (command) {
			const guild = await this.cobalt.db.getGuild(interaction.guild?.id);
			if (guild) {
				if (guild?.disabledCategories?.includes(command.category)) return;
				if (guild?.disabledCommands?.includes(command.name)) return;
				if (command.devOnly && !this.isDev(interaction)) {
					return;
				}
				if (interaction.channel instanceof TextChannel) {
					const userPermissions = command.userPermissions;
					const clientPermissions = command.clientPermissions;
					const missingPermissions = new Array();
					if (userPermissions?.length) {
						for (let i = 0; i < userPermissions.length; i++) {
							const hasPermissions = interaction.channel
								.permissionsFor(interaction.member as GuildMember)
								?.has(userPermissions[i]);
							if (!hasPermissions) missingPermissions.push(userPermissions[i]);
						}
						if (missingPermissions.length)
							return interaction.reply({
								content: `Your missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								ephemeral: true,
							});
					}
					if (clientPermissions?.length) {
						for (let i = 0; i < clientPermissions.length; i++) {
							const hasPermission = interaction.guild?.me?.permissions.has(clientPermissions[i]);
							if (!hasPermission) missingPermissions.push(clientPermissions[i]);
						}
						if (missingPermissions.length)
							return interaction.reply({
								content: `I\'m missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								ephemeral: true,
							});
					}
				}
			}
			try {
				await command.run(interaction);
			} catch (err) {
				console.log(err);
				return interaction.reply({ content: 'An unexpected error occurred' });
			}
		}
	}

	isDev(inteaction: CommandInteraction) {
		const owners = process.env.OWNERS?.split(',');
		return owners?.includes(inteaction.user.id);
	}
}

export default InteractionEvent;
