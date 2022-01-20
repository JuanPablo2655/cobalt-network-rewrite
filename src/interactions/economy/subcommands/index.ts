import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { jobs } from '#lib/data';
import { CobaltClient } from '#lib/cobaltClient';
import { addMulti, calcMulti, formatMoney, formatNumber } from '#utils/util';
import { Default } from '#lib/typings';
import { days, months } from '#utils/common';
import { Identifiers, UserError } from '#lib/errors';

export async function work(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = await cobalt.db.getUser(interaction.user.id);
	if (!user) throw new Error('Missing user database entry');
	if (user.job === null)
		throw new UserError({ identifer: Identifiers.PreconditionMissingData }, 'You need a job to work.');
	const job = jobs.find(j => j.id === user.job);
	// TODO(Isidro): return an error
	if (!job) throw new Error('Invalid job id');
	const workEntry = job?.entries[Math.floor(Math.random() * job?.entries.length)];
	const money = Math.floor(job.minAmount + Math.random() * 250);
	const multi = await calcMulti(interaction.user, cobalt);
	const moneyEarned = addMulti(money, multi);
	await cobalt.econ.addToWallet(interaction.user.id, moneyEarned);
	const cleanEntry = workEntry
		?.replace(/{user.username}/g, interaction.user.username)
		.replace(/{money}/g, formatNumber(moneyEarned) ?? '0');
	return interaction.reply({ content: cleanEntry });
}

export async function pay(cobalt: CobaltClient, interaction: CommandInteraction) {
	const bot = await cobalt.db.getBot(interaction.client.user?.id);
	const member = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	const author = await cobalt.db.getUser(interaction.user.id);
	if (!author) throw new Error('Missing author database entry');
	if (member.id === interaction.user.id)
		throw new UserError({ identifer: Identifiers.ArgumentUserError }, "You can't pay yourself");
	if ((author?.wallet ?? Default.Wallet) < amount)
		throw new UserError(
			{ identifer: Identifiers.ArgumentIntegerTooLarge },
			`You don't have enough to pay that much. You currently have **${formatMoney(author.wallet)}**`,
		);
	const tax = Math.round(amount * ((bot?.tax ?? Default.Tax) / 100));
	const afterTax = amount - tax;
	await cobalt.econ.removeFromWallet(interaction.user.id, amount);
	await cobalt.econ.addToWallet(member.id, afterTax);
	await cobalt.db.updateBot(interaction.client.user?.id, { bank: (bot?.bank ?? 0) + tax });
	return interaction.reply({
		content: `>>> Transaction to **${member.username}**:\nSubtotal: **${formatMoney(amount)}**\nTaxes: **${formatMoney(
			tax,
		)}**\nTotal: **${formatMoney(afterTax)}**`,
	});
}

export async function balance(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = await cobalt.db.getUser(user.id);
	const bankPercent = ((profile?.bank ?? Default.Bank) / (profile?.bankSpace ?? Default.BankSpace)) * 100;
	const balanceEmbed = new MessageEmbed()
		.setTitle(`${user.username}'s balance`)
		.setDescription(
			`**Wallet**: ${formatMoney(profile?.wallet ?? Default.Wallet)}\n**Bank**: ${formatMoney(
				profile?.bank ?? Default.Bank,
			)} / ${formatMoney(profile?.bankSpace ?? Default.BankSpace)} \`${bankPercent
				.toString()
				.substring(0, 4)}%\`\n**Net Worth**: ${formatMoney(profile?.netWorth ?? 0)}\n**Bounty**: ${formatMoney(
				profile?.bounty ?? 0,
			)}`,
		);
	interaction.reply({ embeds: [balanceEmbed] });
}

export async function daily(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	if (!user) throw new Error('Missing user database entry');
	const date = Date.now();
	const cooldown = date + days(1);
	// TODO(Isidro): fix the is doodoo code
	if (!isNaN(user.daily!) && user.daily! > date) {
		throw new UserError(
			{ identifer: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(user.daily! - Date.now())}** left before you can claim your daily!`,
		);
	}
	if (member.id === interaction.user.id) {
		const dailyAmount = Math.floor(250 + Math.random() * 150);
		await cobalt.db.updateUser(interaction.user.id, { daily: cooldown });
		await cobalt.econ.addToWallet(member.id, dailyAmount);
		return interaction.reply({
			content: `You have received your daily **${formatMoney(dailyAmount)}**.`,
		});
	}
	const dailyAmount = Math.floor(250 + Math.random() * 150);
	const moneyEarned = addMulti(dailyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { daily: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your daily of **${formatMoney(moneyEarned)}** to **${member?.username}**.`,
	});
}

export async function weekly(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	if (!user) throw new Error('Missing user database entry');
	const date = Date.now();
	const cooldown = date + days(7);
	if (!isNaN(user.weekly!) && user.weekly! > date)
		throw new UserError(
			{ identifer: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(user.weekly! - Date.now())}** left before you can claim your weekly!`,
		);
	if (member?.id === interaction.user.id) {
		const weeklyAmount = Math.floor(750 + Math.random() * 250);
		await cobalt.db.updateUser(interaction.user.id, { weekly: cooldown });
		await cobalt.econ.addToWallet(member.id, weeklyAmount);
		return interaction.reply({
			content: `You have received your weekly **${formatMoney(weeklyAmount)}**.`,
		});
	}
	const weeklyAmount = Math.floor(750 + Math.random() * 750);
	const moneyEarned = addMulti(weeklyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { weekly: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your weekly of **${formatMoney(moneyEarned)}** to **${member?.username}**.`,
	});
}

export async function monthly(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	if (!user) throw new Error('Missing user database entry');
	const date = Date.now();
	const cooldown = date + months(1);
	if (!isNaN(user.monthly!) && user.monthly! > date)
		throw new UserError(
			{ identifer: Identifiers.PreconditionCooldown },
			`You still have **${prettyMilliseconds(user.monthly! - Date.now())}** left before you can claim your monthly!`,
		);
	if (member?.id === interaction.user.id) {
		const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
		await cobalt.db.updateUser(interaction.user.id, { monthly: cooldown });
		await cobalt.econ.addToWallet(member.id, monthlyAmount);
		return interaction.reply({
			content: `You have received your monthly **${formatMoney(monthlyAmount)}**.`,
		});
	}
	const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
	const moneyEarned = addMulti(monthlyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { monthly: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your monthly of **${formatMoney(moneyEarned)}** to **${member?.username}**.`,
	});
}
