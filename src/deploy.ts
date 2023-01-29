import { envParseString } from '@skyra/env-utilities';
import {
	type Snowflake,
	type RESTGetAPIApplicationGuildCommandsResult,
	ApplicationCommandPermissionType,
	Routes,
} from 'discord-api-types/v10';
import { REST } from 'discord.js';
import { parseClient } from './config.js';
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

const client = parseClient();
const rest = new REST({ version: '10' }).setToken(envParseString('DISCORD_TOKEN'));

(async () => {
	try {
		console.log('Start refreshing interaction (/) commands.');

		const commands = (await rest.put(
			Routes.applicationGuildCommands(client.id as Snowflake, '823300821994569748' as Snowflake),
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
			Routes.guildApplicationCommandsPermissions(client.id as Snowflake, '823300821994569748' as Snowflake),
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
	} catch (error) {
		console.error(error);
	}
})();

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string;
	}
}
