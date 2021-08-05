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
					type: 3,
					name: 'parameter',
					description: 'Get covid-19 data from global, country, or state.',
					choices: [
						{
							name: 'country',
							value: 'Get the countries covid-19 data.',
						},
						{
							name: 'state',
							value: "Get the state's covid-19 data.",
						},
						{
							name: 'global',
							value: "Get the global's covid-19 data.",
						},
					],
					required: true,
				},
				{
					type: 3,
					name: 'name',
					description: "Get the state's or countries covid-19 data.",
				},
			],
		});
	}

	async run(interaction: CommandInteraction) {
		await interaction.defer();
		const parameter = interaction.options.getString('parameter', true);
		if (parameter === 'global') {
			const all = await fetch(`https://disease.sh/v3/covid-19/all`);
			const res = await all.json();
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+ ${this.cobalt.utils.formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(
						res.recovered,
					)} (+ ${this.cobalt.utils.formatNumber(
						res.todayRecovered,
					)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return interaction.editReply({ embeds: [covidEmbed] });
		}
		if (parameter === 'country') {
			const name = interaction.options.getString('parameter');
			if (!name) return interaction.editReply({ content: 'I need a country name.' });
			const country = await fetch(`https://disease.sh/v3/covid-19/countries/${name}?strict=false`);
			const res = await country.json();
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+ ${this.cobalt.utils.formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(
						res.recovered,
					)} (+ ${this.cobalt.utils.formatNumber(
						res.todayRecovered,
					)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return interaction.editReply({ embeds: [covidEmbed] });
		}
		if (parameter === 'state') {
			const name = interaction.options.getString('parameter');
			if (!name) return interaction.editReply({ content: 'I need a correct state name. Ex. New York.' });
			const state = await fetch(`https://disease.sh/v3/covid-19/states/${name}`);
			const res = await state.json();
			if (res.message === "State not found or doesn't have any cases")
				return interaction.editReply({ content: 'I need a correct state name. Ex. New York.' });
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
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
	}
}

export default CovidInteraction;
