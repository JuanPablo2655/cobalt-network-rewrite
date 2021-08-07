import { CommandInteraction, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Interaction from '../../struct/Interaction';

abstract class CovidInteraction extends Interaction {
	constructor() {
		super({
			name: 'covid',
			descrition: 'Get the lastest Covid-19 data.',
			category: 'utility',
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
		const res = await country.json();
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19: ${res.country}`)
			.setDescription(
				`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+ ${this.cobalt.utils.formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(res.recovered)} (+ ${this.cobalt.utils.formatNumber(
					res.todayRecovered,
				)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}

	async state(interaction: CommandInteraction) {
		await interaction.deferReply();
		const name = interaction.options.getString('state', true);
		const state = await fetch(`https://disease.sh/v3/covid-19/states/${name}`);
		const res = await state.json();
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19: ${res.state}`)
			.setDescription(
				`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+ ${this.cobalt.utils.formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(
					res.recovered,
				)}**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}

	async global(interaction: CommandInteraction) {
		await interaction.deferReply();
		const all = await fetch(`https://disease.sh/v3/covid-19/all`);
		const res = await all.json();
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19 World Data`)
			.setDescription(
				`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+ ${this.cobalt.utils.formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(res.recovered)} (+ ${this.cobalt.utils.formatNumber(
					res.todayRecovered,
				)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return interaction.editReply({ embeds: [covidEmbed] });
	}
}

export default CovidInteraction;
