import { ApplicationCommandOptionData } from 'discord.js';

export const devOptions: ApplicationCommandOptionData[] = [
	{
		type: 1,
		name: 'reboot',
		description: 'Reboot the bot. Only works if using pm2 or anything else simillar.',
	},
	{
		type: 1,
		name: 'pay',
		description: 'Pay someone tax money.',
		options: [
			{
				type: 6,
				name: 'user',
				description: 'The user.',
				required: true,
			},
			{
				type: 4,
				name: 'amount',
				description: 'Amount of tax money.',
				required: true,
			},
		],
	},
	{
		type: 2,
		name: 'update',
		description: 'Update bot settings.',
		options: [
			{
				type: 1,
				name: 'directors',
				description: 'Update the directors.',
			},
			{
				type: 1,
				name: 'tax',
				description: 'Update the tax rate for all the users who use the bot.',
				options: [
					{
						type: 10,
						name: 'tax',
						description: 'Tax rate.',
						required: true,
					},
				],
			},
		],
	},
];
