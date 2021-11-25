import { CommandInteraction, MessageEmbed } from 'discord.js';
import { jobs } from '#lib/data';
import { CobaltClient } from '#lib/cobaltClient';
import { formatMoney } from '#utils/util';

export async function apply(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = await cobalt.db.getUser(interaction.user.id);
	const jobId = interaction.options.getString('job', true);
	const job = jobs.find(j => j.id === jobId.toLowerCase());
	if (!job) return interaction.reply({ content: 'Please pick a valid job with a valid job id to apply for.' });
	if (user?.job === null) {
		await cobalt.econ.updateJob(interaction.user.id, job.id);
		return interaction.reply({
			content: `Congraduations on becoming a **${job.name}**. Your minimum payment is now **${formatMoney(
				job.minAmount,
			)}**`,
		});
	} else {
		return interaction.reply({ content: `You have a job already. If you want to switch you have to quit your job` });
	}
}

export async function quit(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = await cobalt.db.getUser(interaction.user.id);
	if (user?.job === null) return interaction.reply({ content: `You don't have a job to quit from.` });
	await cobalt.econ.updateJob(interaction.user.id, null);
	return interaction.reply({
		content: `You have successfully quit from your current job. You need to apply to a new job if you want to work.`,
	});
}

export async function list(_cobalt: CobaltClient, interaction: CommandInteraction) {
	let joblists: string[] = new Array();
	jobs.forEach(job => {
		joblists.push(`\`${job.id}\` - **${job.name}**: ₡${job.minAmount}`);
	});
	const jobEmbed = new MessageEmbed().setTitle(`Job Listing`).setDescription(`${joblists.join('\n')}`);
	interaction.reply({ embeds: [jobEmbed] });
}
