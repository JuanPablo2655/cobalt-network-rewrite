import dotenv from 'dotenv';
dotenv.config();
import { REST } from '@discordjs/rest';
import {
	ApplicationCommandPermissionType,
	RESTGetAPIApplicationGuildCommandsResult,
	Routes,
	Snowflake,
} from 'discord-api-types/v9';
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

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!);

(async () => {
	try {
		console.log('Start refreshing interaction (/) commands.');

		const commands = (await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID as Snowflake, '823300821994569748' as Snowflake),
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
			Routes.guildApplicationCommandsPermissions(process.env.CLIENT_ID as Snowflake, '823300821994569748' as Snowflake),
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
