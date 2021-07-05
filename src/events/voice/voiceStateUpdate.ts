import { MessageEmbed, TextChannel, VoiceState } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import Event from '../../struct/Event';

abstract class VoiceStateUpdate extends Event {
	constructor() {
		super({
			name: 'voiceStateUpdate',
		});
	}

	async run(oldState: VoiceState, newState: VoiceState) {
		if (!this.cobalt.testEvents) return;
		if (oldState.member?.partial) await oldState.member.fetch();
		if (!oldState.guild || !newState.guild) return;
		if (!oldState.guild.available || !newState.guild.available) return;
		const guild = await this.cobalt.db.getGuild(newState.guild.id);
		if (!guild) return;
		if (!guild.logChannel.enabled) return;
		const user = await this.cobalt.db.getUser(newState.member!.id);
		const member = await this.cobalt.db.getMember(newState.member?.id, newState.guild.id);
		const logChannelId = guild.logChannel.channelId;
		const logChannel = this.cobalt.guilds.cache.get(newState.guild.id)?.channels.cache.get(logChannelId) as TextChannel;
		const avatar = newState.member?.user.displayAvatarURL({ format: 'png', dynamic: true });
		const logEmbed = new MessageEmbed()
			.setAuthor(newState.member!.user.username, avatar)
			.setFooter(`User ID: ${newState.member!.id}`)
			.setTimestamp();
		if (!oldState.channel && newState.channel) {
			if (newState.member?.user.bot) return;
			const start = Date.now();
			this.cobalt.voiceTime.set(newState.member!.id, start);
			logEmbed.setTitle(`Member Joined VC`).setDescription(`**VC Channel:** ${newState.channel}`);
			logChannel.send({ embeds: [logEmbed] });
		}
		if (oldState.channel && !newState.channel) {
			if (oldState.member?.user.bot) return;
			const end = Date.now();
			let startTime = this.cobalt.voiceTime.get(oldState.member!.id);
			if (startTime) {
				const elapsed = end - startTime;
				const time = elapsed / 60000;
				const addMoney = Math.round(time * 9) + 1;
				await this.cobalt.econ.addToWallet(oldState.member!.id, addMoney);
				await this.cobalt.db.updateUser(oldState.member?.id, { vcHours: user!.vcHours + elapsed });
				await this.cobalt.db.updateMember(oldState.member?.id, oldState.guild.id, {
					vcHours: member!.vcHours + elapsed,
				});
				oldState.member
					?.send(
						`You have earned **₡${this.cobalt.utils.formatNumber(addMoney)}** for spending **${prettyMilliseconds(
							elapsed,
						)}** in VC.`,
					)
					.catch(err => console.error(err));
				logEmbed
					.setTitle(`Member Left VC`)
					.setDescription(
						`**VC Channel:** ${oldState.channel}\n**Time Elapsed:** ${prettyMilliseconds(elapsed, { verbose: true })}`,
					);
				this.cobalt.voiceTime.delete(oldState.member!.id);
			} else {
				logEmbed.setTitle(`Member Left VC`).setDescription(`**VC Channel:** ${oldState.channel}`);
			}
			logChannel.send({ embeds: [logEmbed] });
		}
		if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			if (newState.member?.user.bot) return;
			logEmbed
				.setTitle(`Member Switched VC`)
				.setDescription(`**From:** ${oldState.channel}\n**To:** ${newState.channel}`);
			logChannel.send({ embeds: [logEmbed] });
		}
	}
}

export default VoiceStateUpdate;