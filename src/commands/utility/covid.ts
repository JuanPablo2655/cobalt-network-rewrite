import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import GenericCommand from '../../struct/GenericCommand';

abstract class CovidCommand extends GenericCommand {
	constructor() {
		super({
			name: 'covid',
			description: 'Get the lastest Covid-19 data',
			category: 'utility',
		});
	}

	async run(message: Message, args: string[], addCD: Function) {
		const [parameter, ...path] = args;
		if (parameter === 'global') {
			const all = await fetch(`https://disease.sh/v3/covid-19/all`);
			const res = await all.json();
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+${this.cobalt.utils.formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(res.recovered)} (+${this.cobalt.utils.formatNumber(
						res.todayRecovered,
					)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return message.channel.send({ embeds: [covidEmbed] });
		}
		if (parameter === 'country') {
			if (!path[0]) return message.reply('I need a correct country name. Ex: USA or United States.');
			const country = await fetch(`https://disease.sh/v3/covid-19/countries/${path.join('%20')}?strict=false`);
			const res = await country.json();
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+${this.cobalt.utils.formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(res.recovered)} (+${this.cobalt.utils.formatNumber(
						res.todayRecovered,
					)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return message.channel.send({ embeds: [covidEmbed] });
		}
		if (parameter === 'state') {
			if (!path[0]) return message.reply('I need a correct state name. Ex. New York.');
			const state = await fetch(`https://disease.sh/v3/covid-19/states/${path.join('%20')}`);
			const res = await state.json();
			if (res.message === "State not found or doesn't have any cases")
				return message.reply('I need a correct state name. Ex. New York.');
			const covidEmbed = new MessageEmbed()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+${this.cobalt.utils.formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(
						res.recovered,
					)}**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return message.channel.send({ embeds: [covidEmbed] });
		}
		addCD();
		const all = await fetch(`https://disease.sh/v3/covid-19/all`);
		const res = await all.json();
		const covidEmbed = new MessageEmbed()
			.setTitle(`COVID-19 World Data`)
			.setDescription(
				`Total Cases: **${this.cobalt.utils.formatNumber(res.cases)} (+ ${this.cobalt.utils.formatNumber(
					res.todayCases,
				)})**\nTotal Deaths: **${this.cobalt.utils.formatNumber(res.deaths)} (+${this.cobalt.utils.formatNumber(
					res.todayDeaths,
				)})**\nTotal Recovered: **${this.cobalt.utils.formatNumber(res.recovered)} (+${this.cobalt.utils.formatNumber(
					res.todayRecovered,
				)})**\nActive Cases: **${this.cobalt.utils.formatNumber(res.active)}**`,
			)
			.setTimestamp(res.updated);
		return message.channel.send({ embeds: [covidEmbed] });
	}
}

export default CovidCommand;
