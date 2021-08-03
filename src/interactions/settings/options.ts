import { ApplicationCommandOptionData } from 'discord.js';

export const settingOptions: ApplicationCommandOptionData[] = [
	{
		type: 2,
		name: 'logchannel',
		description: 'Update the log channel or toggle the log channel.',
		options: [
			{
				type: 1,
				name: 'toggle',
				description: 'Toggle the log channel to be on or off.',
				options: [
					{
						type: 5,
						name: 'boolean',
						description: 'Toogle the log channel.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'channel',
				description: 'Update the log channel.',
				options: [
					{
						type: 7,
						name: 'channel',
						description: 'The log channel.',
						required: true,
					},
				],
			},
		],
	},
	{
		type: 2,
		name: 'leavechannel',
		description: 'Manage the leave channel in your server.',
		options: [
			{
				type: 1,
				name: 'message',
				description: 'Update the leave channel message.',
				options: [
					{
						type: 3,
						name: 'message',
						description: 'The leave channel message.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'channel',
				description: 'Update the leave channel.',
				options: [
					{
						type: 7,
						name: 'channel',
						description: 'The leave channel.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'toggle',
				description: 'Toggle the leave channel to be on or off.',
				options: [
					{
						type: 5,
						name: 'toggle',
						description: 'Toggle the leave channel.',
						required: true,
					},
				],
			},
		],
	},
	{
		type: 2,
		name: 'welcomechannel',
		description: 'Manage the welcome channel in your server.',
		options: [
			{
				type: 1,
				name: 'message',
				description: 'Update the welcome message.',
				options: [
					{
						type: 3,
						name: 'message',
						description: 'The welcome message.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'channel',
				description: 'Update the welcome channel.',
				options: [
					{
						type: 7,
						name: 'channel',
						description: 'The welcome channel.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'toggle',
				description: 'Toggle the welcome channel to be on or off.',
				options: [
					{
						type: 5,
						name: 'toggle',
						description: 'Toggle the welcome channel.',
						required: true,
					},
				],
			},
		],
	},
	{
		type: 1,
		name: 'category',
		description: 'Toggle a category to be on or off.',
		options: [
			{
				type: 3,
				name: 'name',
				description: 'Name of the category',
				required: true,
			},
			{
				type: 5,
				name: 'toggle',
				description: 'Toggle the category.',
				required: true,
			},
		],
	},
	{
		type: 1,
		name: 'command',
		description: 'Toggle a command to be on or off.',
		options: [
			{
				type: 3,
				name: 'name',
				description: 'Name of the command',
				required: true,
			},
			{
				type: 5,
				name: 'toggle',
				description: 'Toggle the command.',
				required: true,
			},
		],
	},
	{
		type: 1,
		name: 'event',
		description: 'Toggle an event to be on or off.',
		options: [
			{
				type: 3,
				name: 'name',
				description: 'Name of the event',
				required: true,
			},
			{
				type: 5,
				name: 'toggle',
				description: 'Toggle the event.',
				required: true,
			},
		],
	},
	{
		type: 2,
		name: 'blacklistword',
		description: 'Update the word blacklist.',
		options: [
			{
				type: 1,
				name: 'add',
				description: 'Add a word to the blacklist.',
				options: [
					{
						type: 3,
						name: 'word',
						description: 'The blacklisted word.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'remove',
				description: 'Remove a word to the blacklist.',
				options: [
					{
						type: 3,
						name: 'word',
						description: 'The blacklisted word.',
						required: true,
					},
				],
			},
			{
				type: 1,
				name: 'list',
				description: 'List all the blacklisted words',
			},
		],
	},
];
