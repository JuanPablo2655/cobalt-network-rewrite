import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import jobs from '../../../data/jobs';
import { CobaltClient } from '../../../struct/cobaltClient';

export async function work(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = await cobalt.db.getUser(interaction.user.id);
	if (user?.job === null) return interaction.reply({ content: 'You need a job to work.' });
	const job = jobs.find(j => j.id === user?.job);
	const workEntry = job?.entries[Math.floor(Math.random() * job?.entries.length)];
	const money = Math.floor(job!.minAmount + Math.random() * 250);
	const multi = await cobalt.utils.calcMulti(interaction.user);
	const moneyEarned = cobalt.utils.addMulti(money, multi);
	await cobalt.econ.addToWallet(interaction.user.id, moneyEarned);
	const cleanEntry = workEntry
		?.replace(/{user.username}/g, interaction.user.username)
		.replace(/{money}/g, cobalt.utils.formatNumber(moneyEarned));
	return interaction.reply({ content: cleanEntry });
}

export async function pay(cobalt: CobaltClient, interaction: CommandInteraction) {
	const bot = await cobalt.db.getBot(interaction.client.user?.id);
	const member = interaction.options.getUser('user', true);
	const amount = interaction.options.getInteger('amount', true);
	const author = await cobalt.db.getUser(interaction.user.id);
	if (member.id === interaction.user.id) return interaction.reply({ content: "You can't pay yourself!" });
	if (author!.wallet < amount)
		return interaction.reply({
			content: `You don't have enough to pay that much. You currently have **₡${cobalt.utils.formatNumber(
				author!.wallet,
			)}**`,
		});
	const tax = Math.round(amount * (bot!.tax / 100));
	const afterTax = amount - tax;
	await cobalt.econ.removeFromWallet(interaction.user.id, amount);
	await cobalt.econ.addToWallet(member.id, afterTax);
	await cobalt.db.updateBot(interaction.client.user?.id, { bank: bot!.bank + tax });
	return interaction.reply({
		content: `>>> Transaction to **${member.username}**:\nSubtotal: **₡${cobalt.utils.formatNumber(
			amount,
		)}**\nTaxes: **₡${cobalt.utils.formatNumber(tax)}**\nTotal: **₡${cobalt.utils.formatNumber(afterTax)}**`,
	});
}

export async function balance(cobalt: CobaltClient, interaction: CommandInteraction) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const profile = await cobalt.db.getUser(user.id);
	const bankPercent = (profile!.bank / profile!.bankSpace) * 100;
	const balanceEmbed = new MessageEmbed()
		.setTitle(`${user.username}'s balance`)
		.setDescription(
			`**Wallet**: ₡${cobalt.utils.formatNumber(profile!.wallet)}\n**Bank**: ₡${cobalt.utils.formatNumber(
				profile!.bank,
			)} / ₡${cobalt.utils.formatNumber(profile!.bankSpace)} \`${bankPercent
				.toString()
				.substring(0, 4)}%\`\n**Net Worth**: ₡${cobalt.utils.formatNumber(
				profile!.netWorth,
			)}\n**Bounty**: ₡${cobalt.utils.formatNumber(profile!.bounty)}`,
		);
	interaction.reply({ embeds: [balanceEmbed] });
}

export async function daily(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	const date = Date.now();
	const cooldown = date + 86400000;
	if (!isNaN(user!.daily) && user!.daily > date) {
		return interaction.reply({
			content: `You still have **${prettyMilliseconds(
				user!.daily - Date.now(),
			)}** left before you can claim your daily!`,
		});
	}
	if (member?.id === interaction.user.id) {
		const dailyAmount = Math.floor(250 + Math.random() * 150);
		await cobalt.db.updateUser(interaction.user.id, { daily: cooldown });
		await cobalt.econ.addToWallet(member.id, dailyAmount);
		return interaction.reply({
			content: `You have received your daily **₡${cobalt.utils.formatNumber(dailyAmount)}**.`,
		});
	}
	const dailyAmount = Math.floor(250 + Math.random() * 150);
	const moneyEarned = cobalt.utils.addMulti(dailyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { daily: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your daily of **₡${cobalt.utils.formatNumber(moneyEarned)}** to **${member?.username}**.`,
	});
}

export async function weekly(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	const date = Date.now();
	const cooldown = date + 604800000;
	if (!isNaN(user!.weekly) && user!.weekly > date) {
		return interaction.reply({
			content: `You still have **${prettyMilliseconds(
				user!.weekly - Date.now(),
			)}** left before you can claim your weekly!`,
		});
	}
	if (member?.id === interaction.user.id) {
		const weeklyAmount = Math.floor(750 + Math.random() * 250);
		await cobalt.db.updateUser(interaction.user.id, { weekly: cooldown });
		await cobalt.econ.addToWallet(member.id, weeklyAmount);
		return interaction.reply({
			content: `You have received your weekly **₡${cobalt.utils.formatNumber(weeklyAmount)}**.`,
		});
	}
	const weeklyAmount = Math.floor(750 + Math.random() * 750);
	const moneyEarned = cobalt.utils.addMulti(weeklyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { weekly: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your weekly of **₡${cobalt.utils.formatNumber(moneyEarned)}** to **${member?.username}**.`,
	});
}

export async function monthly(cobalt: CobaltClient, interaction: CommandInteraction) {
	const member = interaction.options.getUser('user') ?? interaction.user;
	const user = await cobalt.db.getUser(member.id);
	const date = Date.now();
	const cooldown = date + 2629800000;
	if (!isNaN(user!.monthly) && user!.monthly > date) {
		return interaction.reply({
			content: `You still have **${prettyMilliseconds(
				user!.monthly - Date.now(),
			)}** left before you can claim your monthly!`,
		});
	}
	if (member?.id === interaction.user.id) {
		const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
		await cobalt.db.updateUser(interaction.user.id, { monthly: cooldown });
		await cobalt.econ.addToWallet(member.id, monthlyAmount);
		return interaction.reply({
			content: `You have received your monthly **₡${cobalt.utils.formatNumber(monthlyAmount)}**.`,
		});
	}
	const monthlyAmount = Math.floor(3500 + Math.random() * 1500);
	const moneyEarned = cobalt.utils.addMulti(monthlyAmount, 10);
	await cobalt.db.updateUser(interaction.user.id, { monthly: cooldown });
	await cobalt.econ.addToWallet(member!.id, moneyEarned);
	return interaction.reply({
		content: `You gave your monthly of **₡${cobalt.utils.formatNumber(moneyEarned)}** to **${member?.username}**.`,
	});
}
