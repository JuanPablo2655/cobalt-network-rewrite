import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { jobs } from '#lib/data';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';

export async function apply(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = await cobalt.container.db.getUser(interaction.user.id);
	const jobId = interaction.options.getString('job', true);
	const job = jobs.find(j => j.id === jobId.toLowerCase());
	if (!job)
		throw new UserError(
			{ identifer: Identifiers.PreconditionMissingData },
			'Please pick a valid job with a valid job id to apply for',
		);
	if (user?.job !== null)
		throw new UserError(
			{ identifer: Identifiers.PreconditionDataExists },
			'You have a job already. If you want to switch, you have to quit your job',
		);
	await cobalt.container.econ.updateJob(interaction.user.id, job.id);
	return interaction.reply({
		content: `Congraduations on becoming a **${job.name}**. Your minimum payment is now **${formatMoney(
			job.minAmount,
		)}**`,
	});
}

export async function quit(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = await cobalt.container.db.getUser(interaction.user.id);
	if (user?.job === null)
		throw new UserError({ identifer: Identifiers.PreconditionDataExists }, `You don't have a job to quit from`);
	await cobalt.container.econ.updateJob(interaction.user.id, null);
	return interaction.reply({
		content: `You have successfully quit from your current job. You need to apply to a new job if you want to work.`,
	});
}

export async function list(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const joblists = jobs.map(job => `\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
	const jobEmbed = new EmbedBuilder().setTitle(`Job Listing`).setDescription(`${joblists.join('\n')}`);
	interaction.reply({ embeds: [jobEmbed] });
}
