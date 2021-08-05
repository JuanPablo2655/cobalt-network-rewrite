import { ApplicationCommandOptionData } from 'discord.js';

export const experienceOptions: ApplicationCommandOptionData[] = [
	{
		type: 1,
		name: 'rank',
		description: 'Get your or someone elses rank in the server.',
		options: [
			{
				type: 6,
				name: 'user',
				description: 'The user.',
			},
		],
	},
	{
		type: 1,
		name: 'reputation',
		description: 'Give someone a reputation point.',
		options: [
			{
				type: 6,
				name: 'user',
				description: 'The user.',
				required: true,
			},
		],
	},
];