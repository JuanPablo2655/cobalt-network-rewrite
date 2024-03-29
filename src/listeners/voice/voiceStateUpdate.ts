import { type TextChannel, type VoiceState, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import {
	updateMember,
	updateUser,
	addToWallet,
	getOrCreateUser,
	getOrCreateMember,
	getOrCreateGuild,
} from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { container } from '#root/Container';
import { formatMoney } from '#utils/functions';

const { redis, metrics } = container;

abstract class VoiceStateUpdateListener extends Listener {
	public constructor() {
		super({
			name: 'voiceStateUpdate',
		});
	}

	public async run(oldState: VoiceState, newState: VoiceState) {
		if (!this.cobalt.testListeners) return;
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		if (oldState.member?.partial) await oldState.member.fetch();
		if (newState.member?.partial) await newState.member.fetch();
		if (!oldState.guild || !newState.guild) return;
		if (!oldState.guild.available || !newState.guild.available) return;
		const guild = await getOrCreateGuild(newState.guild.id);
		if (!guild.log.enabled) return;
		if (!oldState.member || !newState.member) return;
		const user = await getOrCreateUser(newState.member.id);
		const member = await getOrCreateMember(newState.member.id, newState.guild.id);
		const logChannelId = guild.log.channelId;
		if (!logChannelId) return;
		const logChannel = newState.guild.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newState.member.user.displayAvatarURL({ extension: 'png', forceStatic: false });
		const logEmbed = new EmbedBuilder()
			.setAuthor({ name: newState.member.user.username, iconURL: avatar })
			.setFooter({ text: `User ID: ${newState.member.id}` })
			.setTimestamp();
		if (!oldState.channel && newState.channel) {
			if (newState.member.user.bot) return;
			const start = Date.now();
			await redis.set(`voice-${newState.member.id}`, start);
			logEmbed.setTitle(`Member Joined VC`).setDescription(`**VC Channel:** ${newState.channel}`);
			return void logChannel?.send({ embeds: [logEmbed] });
		}

		if (oldState.channel && !newState.channel) {
			if (oldState.member.user.bot) return;
			const end = Date.now();
			const startTime = await redis.get(`voice-${newState.member.id}`);
			if (startTime) {
				const elapsed = end - Number(startTime);
				metrics.voiceInc(elapsed);
				metrics.voiceInc(elapsed, oldState.guild.id);
				const time = elapsed / 60_000;
				const addMoney = Math.round(time * 9) + 1;
				await addToWallet(oldState.member.id, addMoney);
				await updateUser(oldState.member.id, { vcHours: [...user.vcHours, elapsed] });
				await updateMember(oldState.member.id, oldState.guild.id, {
					vcHours: [...member.vcHours, elapsed],
				});
				await oldState.member
					.send({
						content: `You have earned **${formatMoney(addMoney)}** for spending **${prettyMilliseconds(
							elapsed,
						)}** in VC.`,
					})
					.catch(error_ => {
						const error = error_ as Error;
						logger.error(error, error.message);
					});
				logEmbed
					.setTitle(`Member Left VC`)
					.setDescription(
						`**VC Channel:** ${oldState.channel}\n**Time Elapsed:** ${prettyMilliseconds(elapsed, { verbose: true })}`,
					);
				await redis.del(`voice-${newState.member.id}`);
			} else {
				logEmbed.setTitle(`Member Left VC`).setDescription(`**VC Channel:** ${oldState.channel}`);
			}

			return void logChannel.send({ embeds: [logEmbed] });
		}

		if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			if (newState.member.user.bot) return;
			logEmbed
				.setTitle(`Member Switched VC`)
				.setDescription(`**From:** ${oldState.channel}\n**To:** ${newState.channel}`);
			return void logChannel?.send({ embeds: [logEmbed] });
		}
	}
}

export default VoiceStateUpdateListener;
