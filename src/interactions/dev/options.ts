import { ApplicationCommandOptionType } from 'discord-api-types/v9';

export const devCommand = {
	name: 'dev',
	description: 'dev only commands',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'reboot',
			description: 'Reboot the bot. Only works if using pm2 or anything else simillar.',
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'pay',
			description: 'Pay someone tax money.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user.',
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: 'amount',
					description: 'Amount of tax money.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'update',
			description: 'Update bot settings.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'directors',
					description: 'Update the directors.',
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'tax',
					description: 'Update the tax rate for all the users who use the bot.',
					options: [
						{
							type: ApplicationCommandOptionType.Number,
							name: 'tax',
							description: 'Tax rate.',
							required: true,
						},
					],
				},
			],
		},
	],
	default_permission: false,
} as const;
