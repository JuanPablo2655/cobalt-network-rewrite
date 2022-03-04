import { ApplicationCommandOptionType } from 'discord-api-types/v9';

export const experienceCommand = {
	name: 'experience',
	description: 'Experience commands.',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'rank',
			description: 'Get your or someone elses rank in the server.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user.',
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'reputation',
			description: 'Give someone a reputation point.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user.',
					required: true,
				},
			],
		},
	],
	default_permission: true,
} as const;
