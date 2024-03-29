import { type Message, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { Identifiers, UserError } from '#lib/errors';
import { GenericCommand } from '#lib/structures';
import type { CovidAll, covidCountry, covidState } from '#lib/typings';
import { formatNumber } from '#utils/functions';

abstract class CovidCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'covid',
			description: 'Get the lastest Covid-19 data',
			category: 'utility',
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		const [parameter, ...path] = args;
		if (parameter === 'global') {
			const all = await fetch(`https://disease.sh/v3/covid-19/all`);
			const res = (await all.json()) as CovidAll;
			const covidEmbed = new EmbedBuilder()
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
			return message.channel.send({ embeds: [covidEmbed] });
		}

		if (parameter === 'country') {
			if (!path[0])
				throw new UserError(
					{ identifier: Identifiers.ArgsMissing },
					'I need a correct country name. Ex: USA or United States.',
				);
			const country = await fetch(`https://disease.sh/v3/covid-19/countries/${path.join('%20')}?strict=false`);
			const res = (await country.json()) as covidCountry;
			const covidEmbed = new EmbedBuilder()
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
			return message.channel.send({ embeds: [covidEmbed] });
		}

		if (parameter === 'state') {
			if (!path[0])
				throw new UserError({ identifier: Identifiers.ArgsMissing }, 'I need a correct state name. Ex. New York.');
			const state = await fetch(`https://disease.sh/v3/covid-19/states/${path.join('%20')}`);
			const res = (await state.json()) as covidState;
			if (res.message === "State not found or doesn't have any cases")
				throw new UserError({ identifier: Identifiers.ArgsMissing }, 'I need a correct state name. Ex. New York.');
			const covidEmbed = new EmbedBuilder()
				.setTitle(`COVID-19 World Data`)
				.setDescription(
					`Total Cases: **${formatNumber(res.cases)} (+ ${formatNumber(
						res.todayCases,
					)})**\nTotal Deaths: **${formatNumber(res.deaths)} (+ ${formatNumber(
						res.todayDeaths,
					)})**\nTotal Recovered: **${formatNumber(res.recovered)}**\nActive Cases: **${formatNumber(res.active)}**`,
				)
				.setTimestamp(res.updated);
			return message.channel.send({ embeds: [covidEmbed] });
		}

		await addCD();
		const all = await fetch(`https://disease.sh/v3/covid-19/all`);
		const res = (await all.json()) as CovidAll;
		const covidEmbed = new EmbedBuilder()
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
		return message.channel.send({ embeds: [covidEmbed] });
	}
}

export default CovidCommand;
