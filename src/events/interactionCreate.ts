import { CommandInteraction, Guild, GuildMember, Interaction, TextChannel } from 'discord.js';
import Event from '../struct/Event';

abstract class InteractionEvent extends Event {
	constructor() {
		super({
			name: 'interactionCreate',
		});
	}

	async run(interaction: Interaction) {
		this.cobalt.metrics.eventInc(this.name);
		if (!interaction.isCommand()) return;
		if (!interaction.command) return;

		const command = this.cobalt.interactions.get(interaction.command.name);
		if (command) {
			const guild = await this.cobalt.db.getGuild(interaction.guild?.id);
			if (guild) {
				if (guild?.disabledCategories?.includes(command.category)) return;
				if (guild?.disabledCommands?.includes(command.name)) return;
				if (command.devOnly && !this.isDev(interaction)) {
					return;
				} else if (command.ownerOnly && !this.isOwner(interaction)) {
					return interaction.reply({
						content: 'This comamnd can only be used by the owner of the guild.',
						ephemeral: true,
					});
				} else if (command.guildOnly && !this.isGuild(interaction)) {
					return interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
				} else if (command.nsfwOnly && !this.isNSFW(interaction)) {
					return interaction.reply({
						content: 'This command can only be used in a NSFW marked channel.',
						ephemeral: true,
					});
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

	isOwner(interaction: CommandInteraction) {
		return (interaction.guild as Guild).ownerId === interaction.user.id;
	}

	isGuild(interaction: CommandInteraction) {
		return interaction.guild instanceof Guild;
	}

	isNSFW(interaction: CommandInteraction) {
		return (interaction.channel as TextChannel).nsfw;
	}
}

export default InteractionEvent;
