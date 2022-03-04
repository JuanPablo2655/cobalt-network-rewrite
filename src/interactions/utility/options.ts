import { ApplicationCommandOptionType } from 'discord-api-types/v9';

export const covidCommand = {
	name: 'covid',
	description: 'Get the lastest Covid-19 data.',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'country',
			description: 'Get covid-19 data from a country.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'country',
					description: 'The country.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'state',
			description: 'Get covid-19 data from a state.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'state',
					description: 'The state.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'global',
			description: 'Get covid-19 data globally.',
		},
	],
	default_permission: true,
} as const;

export const pingCommand = {
	name: 'ping',
	description: 'check the bot ping',
	options: [],
	default_permission: true,
} as const;

export const vcdataCommand = {
	name: 'vcdata',
	description: "Get your's or someone else's vc data locally or globally.",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'option',
			description: 'local or global',
			choices: [
				{
					name: 'local',
					value: 'local',
				},
				{
					name: 'global',
					value: 'global',
				},
			],
			required: true,
		},
		{
			type: ApplicationCommandOptionType.User,
			name: 'user',
			description: 'The user to get the data from.',
		},
	],
	default_permission: true,
} as const;

export const socialCreditCommand = {
	name: 'socialcredit',
	description: 'Social credit system',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'check',
			description: 'Check your or someone elses social credit',
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
			name: 'add',
			description: 'add social credit to a user',
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
					description: 'The amount of points to add.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'remove',
			description: 'The amount of points to remove',
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
					description: 'The amount to remove.',
					required: true,
				},
			],
		},
	],
	default_permission: true,
} as const;
