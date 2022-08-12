import { REST } from 'discord.js';
import {
	ApplicationCommandPermissionType,
	RESTGetAPIApplicationGuildCommandsResult,
	Routes,
	Snowflake,
} from 'discord-api-types/v10';
import {
	covidCommand,
	devCommand,
	economyCommand,
	experienceCommand,
	pingCommand,
	settingCommand,
	vcdataCommand,
	socialCreditCommand,
} from '#root/interactions';
import { config } from './config.js';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rest = new REST({ version: '10' }).setToken(config.token!);

(async () => {
	try {
		console.log('Start refreshing interaction (/) commands.');

		const commands = (await rest.put(
			Routes.applicationGuildCommands(config.client.id as Snowflake, '823300821994569748' as Snowflake),
			{
				body: [
					devCommand,
					economyCommand,
					experienceCommand,
					settingCommand,
					covidCommand,
					pingCommand,
					vcdataCommand,
					socialCreditCommand,
				],
			},
		)) as RESTGetAPIApplicationGuildCommandsResult;

		await rest.put(
			Routes.guildApplicationCommandsPermissions(config.client.id as Snowflake, '823300821994569748' as Snowflake),
			{
				body: commands.map(cmd => ({
					id: cmd.id,
					permissions: [
						{
							id: '288703114473635841' as Snowflake,
							type: ApplicationCommandPermissionType.User,
							permission: true,
						},
					],
				})),
			},
		);

		console.log('Successfully reloaded interaction (/) commands.');
	} catch (e) {
		console.error(e);
	}
})();
