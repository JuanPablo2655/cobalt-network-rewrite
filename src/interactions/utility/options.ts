export const covidCommand = {
	name: 'covid',
	description: 'Get the lastest Covid-19 data.',
	options: [
		{
			type: 1,
			name: 'country',
			description: 'Get covid-19 data from a country.',
			options: [
				{
					type: 3,
					name: 'country',
					description: 'The country.',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'state',
			description: 'Get covid-19 data from a state.',
			options: [
				{
					type: 3,
					name: 'state',
					description: 'The state.',
					required: true,
				},
			],
		},
		{
			type: 1,
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
			type: 3,
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
			type: 6,
			name: 'user',
			description: 'The user to get the data from.',
		},
	],
	default_permission: true,
} as const;
