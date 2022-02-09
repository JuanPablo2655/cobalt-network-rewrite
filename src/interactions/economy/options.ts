import { ApplicationCommandOptionType } from 'discord-api-types/v9';

export const economyCommand = {
	name: 'economy',
	description: 'Economy commands.',
	options: [
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'bank',
			description: 'Manage your bank account',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'deposit',
					description: 'Deposit money in you bank account.',
					options: [
						{
							type: ApplicationCommandOptionType.Integer,
							name: 'amount',
							description: 'Amount of money.',
							required: true,
						},
					],
				},
				{
					type: 1,
					name: 'withdraw',
					description: 'Withdraw money from your bank account.',
					options: [
						{
							type: ApplicationCommandOptionType.Integer,
							name: 'amount',
							description: 'Amount of money.',
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'job',
			description: 'Manage your job.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'apply',
					description: 'Apply to a job.',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'job',
							description: 'The job Id.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'quit',
					description: 'Quit your job.',
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'list',
					description: 'Get a list of jobs you can apply for.',
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'work',
			description: 'Work in your job.',
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'pay',
			description: 'Pay someone some of your money with a tax cut.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: "The user you're going to pay.",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: 'amount',
					description: "The amount of money you're going to pay.",
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'balance',
			description: "Get you or someone else's balance.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The balance of the user.',
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'daily',
			description: 'Claim your daily reward.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user to reward your daily.',
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'weekly',
			description: 'Claim your weekly reward.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user to reward your weekly.',
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'monthly',
			description: 'Claim your monthly reward.',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'The user to reward your monthly.',
				},
			],
		},
	],
	default_permission: true,
};
