import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { jobs } from '#lib/data';
import { CobaltClient } from '#lib/CobaltClient';
import { formatMoney } from '#utils/functions';
import { Identifiers, UserError } from '#lib/errors';
import { createUser, getUser, updateJob } from '#lib/database';

export async function apply(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = (await getUser(interaction.user.id)) ?? (await createUser(interaction.user.id));
	if (!user) throw new Error('Missing user database entry');
	const jobId = interaction.options.getString('job', true);
	const job = jobs.find(j => j.id === jobId.toLowerCase());
	if (!job)
		throw new UserError(
			{ identifier: Identifiers.PreconditionMissingData },
			'Please pick a valid job with a valid job id to apply for',
		);
	if (user.job !== null)
		throw new UserError(
			{ identifier: Identifiers.PreconditionDataExists },
			'You have a job already. If you want to switch, you have to quit your job',
		);
	await updateJob(interaction.user.id, job.id);
	return interaction.reply({
		content: `Congratulations on becoming a **${job.name}**. Your minimum payment is now **${formatMoney(
			job.minAmount,
		)}**`,
	});
}

export async function quit(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = (await getUser(interaction.user.id)) ?? (await createUser(interaction.user.id));
	if (!user) throw new Error('Missing user database entry');
	if (user.job === null)
		throw new UserError({ identifier: Identifiers.PreconditionDataExists }, `You don't have a job to quit from`);
	await updateJob(interaction.user.id, null);
	return interaction.reply({
		content: `You have successfully quit from your current job. You need to apply to a new job if you want to work.`,
	});
}

export async function list(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const jobLists = jobs.map(job => `\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
	const jobEmbed = new EmbedBuilder().setTitle(`Job Listing`).setDescription(`${jobLists.join('\n')}`);
	interaction.reply({ embeds: [jobEmbed] });
}
