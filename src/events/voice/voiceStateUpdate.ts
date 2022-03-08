import { MessageEmbed, TextChannel, VoiceState } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { Listener } from '#lib/structures/listeners';
import { formatMoney } from '#utils/util';
import { logger } from '#lib/structures';

abstract class VoiceStateUpdateListener extends Listener {
	constructor() {
		super({
			name: 'voiceStateUpdate',
		});
	}

	async run(oldState: VoiceState, newState: VoiceState) {
		this.cobalt.metrics.eventInc(this.name);
		if (!this.cobalt.testEvents) return;
		if (oldState.member?.partial) await oldState.member.fetch();
		if (newState.member?.partial) await newState.member.fetch();
		if (!oldState.guild || !newState.guild) return;
		if (!oldState.guild.available || !newState.guild.available) return;
		const guild = await this.cobalt.db.getGuild(newState.guild.id);
		if (!guild) return;
		if (!guild.logChannel?.enabled) return;
		if (!oldState.member || !newState.member) return;
		const user = await this.cobalt.db.getUser(newState.member.id);
		const member = await this.cobalt.db.getMember(newState.member.id, newState.guild.id);
		const logChannelId = guild.logChannel.channelId;
		if (!logChannelId) return;
		const logChannel = newState.guild.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newState.member.user.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor({ name: newState.member.user.username, iconURL: avatar })
			.setFooter({ text: `User ID: ${newState.member.id}` })
			.setTimestamp();
		if (!oldState.channel && newState.channel) {
			if (newState.member.user.bot) return;
			const start = Date.now();
			await this.cobalt.redis.set(`voice-${newState.member.id}`, start);
			logEmbed.setTitle(`Member Joined VC`).setDescription(`**VC Channel:** ${newState.channel}`);
			return void logChannel.send({ embeds: [logEmbed] });
		}
		if (oldState.channel && !newState.channel) {
			if (oldState.member.user.bot) return;
			const end = Date.now();
			const startTime = await this.cobalt.redis.get(`voice-${newState.member.id}`);
			if (startTime) {
				const elapsed = end - Number(startTime);
				this.cobalt.metrics.voiceInc(elapsed);
				this.cobalt.metrics.voiceInc(elapsed, oldState.guild.id);
				const time = elapsed / 60000;
				const addMoney = Math.round(time * 9) + 1;
				await this.cobalt.econ.addToWallet(oldState.member.id, addMoney);
				await this.cobalt.db.updateUser(oldState.member.id, { vcHours: [...(user?.vcHours ?? []), elapsed] });
				await this.cobalt.db.updateMember(oldState.member.id, oldState.guild.id, {
					vcHours: [...(member?.vcHours ?? []), elapsed],
				});
				oldState.member
					.send({
						content: `You have earned **${formatMoney(addMoney)}** for spending **${prettyMilliseconds(
							elapsed,
						)}** in VC.`,
					})
					.catch(err => {
						const error = err as Error;
						logger.error(error, error.message);
					});
				logEmbed
					.setTitle(`Member Left VC`)
					.setDescription(
						`**VC Channel:** ${oldState.channel}\n**Time Elapsed:** ${prettyMilliseconds(elapsed, { verbose: true })}`,
					);
				await this.cobalt.redis.del(`voice-${newState.member.id}`);
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
			return void logChannel.send({ embeds: [logEmbed] });
		}
	}
}

export default VoiceStateUpdateListener;
