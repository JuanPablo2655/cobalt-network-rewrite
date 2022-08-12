import { ApplicationCommandOptionType } from 'discord-api-types/v9';

export const settingCommand = {
	name: 'settings',
	description: 'Update your server settings.',
	options: [
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'logchannel',
			description: 'Update the log channel or toggle the log channel.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'toggle',
					description: 'Toggle the log channel to be on or off.',
					options: [
						{
							type: ApplicationCommandOptionType.Boolean,
							name: 'boolean',
							description: 'Toggle the log channel.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'channel',
					description: 'Update the log channel.',
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							name: 'channel',
							description: 'The log channel.',
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'leavechannel',
			description: 'Manage the leave channel in your server.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'message',
					description: 'Update the leave channel message.',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'message',
							description: 'The leave channel message.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'channel',
					description: 'Update the leave channel.',
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							name: 'channel',
							description: 'The leave channel.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'toggle',
					description: 'Toggle the leave channel to be on or off.',
					options: [
						{
							type: ApplicationCommandOptionType.Boolean,
							name: 'toggle',
							description: 'Toggle the leave channel.',
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'welcomechannel',
			description: 'Manage the welcome channel in your server.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'message',
					description: 'Update the welcome message.',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'message',
							description: 'The welcome message.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'channel',
					description: 'Update the welcome channel.',
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							name: 'channel',
							description: 'The welcome channel.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'toggle',
					description: 'Toggle the welcome channel to be on or off.',
					options: [
						{
							type: ApplicationCommandOptionType.Boolean,
							name: 'toggle',
							description: 'Toggle the welcome channel.',
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'category',
			description: 'Toggle a category to be on or off.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'name',
					description: 'Name of the category',
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'toggle',
					description: 'Toggle the category.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'command',
			description: 'Toggle a command to be on or off.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'name',
					description: 'Name of the command',
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'toggle',
					description: 'Toggle the command.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'event',
			description: 'Toggle an event to be on or off.',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'name',
					description: 'Name of the event',
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: 'toggle',
					description: 'Toggle the event.',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'blacklistword',
			description: 'Update the word blacklist.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'add',
					description: 'Add a word to the blacklist.',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'word',
							description: 'The blacklisted word.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'remove',
					description: 'Remove a word to the blacklist.',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'word',
							description: 'The blacklisted word.',
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'list',
					description: 'List all the blacklisted words',
				},
			],
		},
	],
	default_permission: true,
} as const;
