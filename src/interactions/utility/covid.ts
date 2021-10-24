import { CommandInteraction, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { InteractionCommand } from '../../lib/structures/commands';
import { CovidAll, covidCountry, covidState } from '../../lib/typings/Covid';
import { formatNumber } from '../../lib/utils/util';
import { covidCommand } from './options';

abstract class CovidInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: covidCommand.name,
			category: 'utility',
		});
	}

	async run(interaction: CommandInteraction) {
		const command = interaction.options.getSubcommand(true);
		switch (command) {
			case 'country': {
				await this.country(interaction);
				break;
			}
			case 'state': {
				await this.state(interaction);
				break;
			}
			case 'global': {
				await this.global(interaction);
				break;
			}
			default:
				break;
		}
	}
	async country(interaction: CommandInteraction) {
		await interaction.deferReply();
		const name = interaction.options.getString('country', true);
		const country = await fetch(`https://disease.sh/v3/covid-19/countries/${name}?strict=false`);
		const res = (await country.json()) as covidCountry;
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19: ${res.country}`)
			.setDescription(
				`Total Cases: **${formatNumber(res.cases)} (+ ${formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${formatNumber(res.deaths)} (+ ${formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${formatNumber(res.recovered)} (+ ${formatNumber(
					res.todayRecovered,
				)})**\nActive Cases: **${formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}

	async state(interaction: CommandInteraction) {
		await interaction.deferReply();
		const name = interaction.options.getString('state', true);
		const state = await fetch(`https://disease.sh/v3/covid-19/states/${name}`);
		const res = (await state.json()) as covidState;
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19: ${res.state}`)
			.setDescription(
				`Total Cases: **${formatNumber(res.cases)} (+ ${formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${formatNumber(res.deaths)} (+ ${formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${formatNumber(res.recovered)}**\nActive Cases: **${formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}

	async global(interaction: CommandInteraction) {
		await interaction.deferReply();
		const all = await fetch(`https://disease.sh/v3/covid-19/all`);
		const res = (await all.json()) as CovidAll;
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19 World Data`)
			.setDescription(
				`Total Cases: **${formatNumber(res.cases)} (+ ${formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${formatNumber(res.deaths)} (+ ${formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${formatNumber(res.recovered)} (+ ${formatNumber(
					res.todayRecovered,
				)})**\nActive Cases: **${formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}
}

export default CovidInteractionCommand;
