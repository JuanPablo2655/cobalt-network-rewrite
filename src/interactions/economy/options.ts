export const economyCommand = {
	name: 'economy',
	description: 'Economy commands.',
	options: [
		{
			type: 2,
			name: 'bank',
			description: 'Manage your bank account',
			options: [
				{
					type: 1,
					name: 'deposit',
					description: 'Deposit money in you bank account.',
					options: [
						{
							type: 4,
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
							type: 4,
							name: 'amount',
							description: 'Amount of money.',
							required: true,
						},
					],
				},
			],
		},
		{
			type: 2,
			name: 'job',
			description: 'Manage your job.',
			options: [
				{
					type: 1,
					name: 'apply',
					description: 'Apply to a job.',
					options: [
						{
							type: 3,
							name: 'job',
							description: 'The job Id.',
							required: true,
						},
					],
				},
				{
					type: 1,
					name: 'quit',
					description: 'Quit your job.',
				},
				{
					type: 1,
					name: 'list',
					description: 'Get a list of jobs you can apply for.',
				},
			],
		},
		{
			type: 1,
			name: 'work',
			description: 'Work in your job.',
		},
		{
			type: 1,
			name: 'pay',
			description: 'Pay someone some of your money with a tax cut.',
			options: [
				{
					type: 6,
					name: 'user',
					description: "The user you're going to pay.",
					required: true,
				},
				{
					type: 4,
					name: 'amount',
					description: "The amount of money you're going to pay.",
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'balance',
			description: "Get you or someone else's balance.",
			options: [
				{
					type: 6,
					name: 'user',
					description: 'The balance of the user.',
				},
			],
		},
		{
			type: 1,
			name: 'daily',
			description: 'Claim your daily reward.',
			options: [
				{
					type: 6,
					name: 'user',
					description: 'The user to reward your daily.',
				},
			],
		},
		{
			type: 1,
			name: 'weekly',
			description: 'Claim your weekly reward.',
			options: [
				{
					type: 6,
					name: 'user',
					description: 'The user to reward your weekly.',
				},
			],
		},
		{
			type: 1,
			name: 'monthly',
			description: 'Claim your monthly reward.',
			options: [
				{
					type: 6,
					name: 'user',
					description: 'The user to reward your monthly.',
				},
			],
		},
	],
	default_permission: true,
};
