import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import type { CobaltClient } from '#lib/CobaltClient';
import { jobs } from '#lib/data';
import { addToWallet, getOrCreateBot, getOrCreateUser, removeFromWallet, updateBot, updateUser } from '#lib/database';
import { Identifiers, UserError } from '#lib/errors';
import { days, months } from '#utils/common';
import { addMulti, formatMoney, formatNumber } from '#utils/functions';
import { calcMulti } from '#utils/util';

export async function work(cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = await getOrCreateUser(interaction.user.id);
	if (user.job === null)
		throw new UserError({ identifier: Identifiers.PreconditionMissingData }, 'You need a job to work.');
	const job = jobs.find(j => j.id === user.job);
	if (!job) throw new Error('Invalid job id');
	const workEntry = job.entries[Math.floor(Math.random() * job.entries.length)];
	const money = Math.floor(job.minAmount + Math.random() * 250);
	const multi = await calcMulti(interaction.user, cobalt);
	const moneyEarned = addMulti(money, multi);
	await addToWallet(interaction.user.id, moneyEarned);
	const cleanEntry = workEntry
		?.replace(/{user.username}/g, interaction.user.username)
		.replaceAll('{money}', formatNumber(moneyEarned) ?? '0');
	return interaction.reply({ content: cleanEntry });
}

export async function pay(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const bot = await getOrCreateBot(interaction.client.user.id);
	const member = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	const author = await getOrCreateUser(interaction.user.id);
	if (member.id === interaction.user.id)
		throw new UserError({ identifier: Identifiers.ArgumentUserError }, "You can't pay yourself");
	if (author.wallet < amount)
		throw new UserError(
			{ identifier: Identifiers.ArgumentIntegerTooLarge },
			`You don't have enough to pay that much. You currently have **${formatMoney(author.wallet)}**`,
		);
	const tax = Math.round(amount * (bot.tax / 100));
	const afterTax = amount - tax;
	await removeFromWallet(interaction.user.id, amount);
	await addToWallet(member.id, afterTax);
	await updateBot(interaction.client.user.id, { bank: bot.bank + tax });
	return interaction.reply({
		content: `>>> Transaction to **${member.username}**:\nSubtotal: **${formatMoney(amount)}**\nTaxes: **${formatMoney(
			tax,
		)}**\nTotal: **${formatMoney(afterTax)}**`,
	});
}

export async function balance(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = await getOrCreateUser(user.id);
	const bankPercent = (profile.bank / profile.bankSpace) * 100;
	const balanceEmbed = new EmbedBuilder()
		.setTitle(`${user.username}'s balance`)
		.setDescription(
			`**Wallet**: ${formatMoney(profile.wallet)}\n**Bank**: ${formatMoney(profile.bank)} / ${formatMoney(
				profile.bankSpace,
			)} \`${bankPercent.toString().slice(0, 4)}%\`\n**Net Worth**: ${formatMoney(
				profile.netWorth,
			)}\n**Bounty**: ${formatMoney(profile.bounty)}`,
		);
	await interaction.reply({ embeds: [balanceEmbed] });
}

export async function daily(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await getOrCreateUser(member.id);
	const date = Date.now();
	const cooldown = date + days(1);
	// TODO(Isidro): fix the is doodoo code
	if (user.daily.getTime() > date) {
		throw new UserError(
			{ identifier: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(
				user.daily.getTime() - Date.now(),
			)}** left before you can claim your daily!`,
		);
	}

	if (member.id === interaction.user.id) {
		const dailyAmount = Math.floor(250 + Math.random() * 150);
		await updateUser(interaction.user.id, { daily: new Date(cooldown) });
		await addToWallet(member.id, dailyAmount);
		return interaction.reply({
			content: `You have received your daily **${formatMoney(dailyAmount)}**.`,
		});
	}

	const dailyAmount = Math.floor(250 + Math.random() * 150);
	const moneyEarned = addMulti(dailyAmount, 10);
	await updateUser(interaction.user.id, { daily: new Date(cooldown) });
	await addToWallet(member.id, moneyEarned);
	return interaction.reply({
		content: `You gave your daily of **${formatMoney(moneyEarned)}** to **${member.username}**.`,
	});
}

export async function weekly(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await getOrCreateUser(member.id);
	const date = Date.now();
	const cooldown = date + days(7);
	if (user.weekly.getTime() > date)
		throw new UserError(
			{ identifier: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(
				user.weekly.getTime() - Date.now(),
			)}** left before you can claim your weekly!`,
		);
	if (member.id === interaction.user.id) {
		const weeklyAmount = Math.floor(750 + Math.random() * 250);
		await updateUser(interaction.user.id, { weekly: new Date(cooldown) });
		await addToWallet(member.id, weeklyAmount);
		return interaction.reply({
			content: `You have received your weekly **${formatMoney(weeklyAmount)}**.`,
		});
	}

	const weeklyAmount = Math.floor(750 + Math.random() * 750);
	const moneyEarned = addMulti(weeklyAmount, 10);
	await updateUser(interaction.user.id, { weekly: new Date(cooldown) });
	await addToWallet(member.id, moneyEarned);
	return interaction.reply({
		content: `You gave your weekly of **${formatMoney(moneyEarned)}** to **${member.username}**.`,
	});
}

export async function monthly(_cobalt: CobaltClient, interaction: ChatInputCommandInteraction<'cached'>) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await getOrCreateUser(member.id);
	const date = Date.now();
	const cooldown = date + months(1);
	if (user.monthly.getTime() > date)
		throw new UserError(
			{ identifier: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(
				user.monthly.getTime() - Date.now(),
			)}** left before you can claim your monthly!`,
		);
	if (member.id === interaction.user.id) {
		const monthlyAmount = Math.floor(3_500 + Math.random() * 1_500);
		await updateUser(interaction.user.id, { monthly: new Date(cooldown) });
		await addToWallet(member.id, monthlyAmount);
		return interaction.reply({
			content: `You have received your monthly **${formatMoney(monthlyAmount)}**.`,
		});
	}

	const monthlyAmount = Math.floor(3_500 + Math.random() * 1_500);
	const moneyEarned = addMulti(monthlyAmount, 10);
	await updateUser(interaction.user.id, { monthly: new Date(cooldown) });
	await addToWallet(member.id, moneyEarned);
	return interaction.reply({
		content: `You gave your monthly of **${formatMoney(moneyEarned)}** to **${member.username}**.`,
	});
}
