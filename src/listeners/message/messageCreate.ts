import { setTimeout } from 'node:timers';
import { type Message, Guild, TextChannel, PermissionsBitField } from 'discord.js';
import { awardBankSpace, rewardXp, getOrCreateUser, getOrCreateGuild } from '#lib/database';
import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';
import { container } from '#root/Container';
import { minutes, seconds } from '#utils/common';
import { formatNumber, isOwner } from '#utils/functions';

const { messageCooldowns: cooldowns, metrics, redis, commands } = container;

abstract class MessageListener extends Listener {
	public constructor() {
		super({
			name: 'messageCreate',
		});
	}

	public async run(message: Message) {
		logger.info({ listener: { name: this.name } }, `Listener triggered`);
		metrics.messageInc();
		if (!message.guild) return;
		if (message.guild instanceof Guild) metrics.messageInc(message.guild.id);
		const guild = await getOrCreateGuild(message.guild.id);
		if (!guild) throw new Error('Guild not found in database');

		const escapeRegex = (str?: string) => str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const prefixReg = new RegExp(`^(<@!?${this.cobalt?.user?.id}>|${escapeRegex(guild?.prefix)})\\s*`);
		const prefixArr = message.content.match(prefixReg);
		const prefix = prefixArr?.[0];
		if (message.author.bot) return;
		if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !message.author.bot) {
			let hasBadWord = false;
			const badWords: string[] = [];
			guild.blacklistedWords.forEach(word => {
				message.content.split(' ').forEach(messageWord => {
					if (word.toLowerCase() === messageWord.toLowerCase()) {
						badWords.push(word);
						return (hasBadWord = true);
					}
				});
			});
			if (hasBadWord) {
				message.deletable && message.delete();
				const user = this.cobalt.users.cache.get(message.author.id);
				return void user?.send({
					content: `The word(s) \`${badWords.join(', ')}\` is banned, please watch your language.`,
				});
			}
		}

		// TODO(Isidro): refactor
		if (!message.author.bot) {
			if (!this.cobalt.disableXp && !cooldowns.has(message.author.id)) {
				cooldowns.add(message.author.id);
				setTimeout(() => {
					cooldowns.delete(message.author.id);
				}, minutes(1));
				const _exp = await rewardXp(message);
				const profile = await getOrCreateUser(message.author.id);
				if (!profile) throw new Error('User not found in database');
				if (_exp && guild.level?.enabled) {
					const cleanMessage = guild.level.message
						?.replace(/{user.username}/g, `**${message.author.username}**`)
						.replaceAll(/{user.tag}/g, `**${message.author.tag}**`)
						.replaceAll('{newLevel}', `**${formatNumber(profile.level)}**`);
					await message.channel.send({ content: cleanMessage });
				}
			}

			if (!cooldowns.has(message.author.id)) {
				cooldowns.add(message.author.id);
				setTimeout(() => {
					cooldowns.delete(message.author.id);
				}, minutes(1));
				await awardBankSpace(message);
			}
		}

		if (!prefix) return;
		if (!message.content.toLowerCase().startsWith(prefix)) {
			return; // handle xp and bank space
		}

		const args = message.content.slice(prefix?.length).trim().split(/ +/);
		const commandName: string | undefined = args.shift();
		if (message.mentions.members?.has(this.cobalt.user!.id) && !commandName)
			await message.channel.send({ content: `My prefix is \`${guild?.prefix}\`` });
		if (commandName) {
			const command = commands.get(commandName);
			if (command) {
				if (guild.disabledCategories.includes(command.category)) return;
				if (guild.disabledCommands.includes(command.name)) return;
				if (command.devOnly && !isOwner(message.member!)) {
					return;
				} else if (command.ownerOnly && (message.guild as Guild).ownerId !== message.author.id) {
					return void message.reply({ content: 'This command can only be used by the owner of the guild.' });
				} else if (command.guildOnly && !(message.guild instanceof Guild)) {
					return void message.reply({ content: 'This command can only be used in a guild.' });
				} else if (command.nsfwOnly && !(message.channel as TextChannel).nsfw) {
					return void message.reply({ content: 'This command can only be used in a NSFW marked channel.' });
				}

				if (message.channel instanceof TextChannel) {
					const userPermissions = command.userPermissions;
					const clientPermissions = command.clientPermissions;
					const missingPermissions = [];
					if (userPermissions?.length) {
						for (const userPermission of userPermissions) {
							const hasPermissions = message.member?.permissions.has(userPermission);
							if (!hasPermissions) missingPermissions.push(userPermission);
						}

						if (missingPermissions.length)
							await message.reply({
								content: `Your missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								allowedMentions: { repliedUser: true },
							});
					}

					if (clientPermissions?.length) {
						for (const clientPermission of clientPermissions) {
							const hasPermission = message.guild?.members.me?.permissions.has(clientPermission);
							if (!hasPermission) missingPermissions.push(clientPermission);
						}

						if (missingPermissions.length)
							await message.reply({
								content: `I'm missing these required permissions: ${missingPermissions
									.map(p => `\`${p}\``)
									.join(', ')}`,
								allowedMentions: { repliedUser: true },
							});
					}
				}

				const updateCooldown = async () => {
					if (command.cooldown) {
						const now = Date.now();
						const timestamp = await redis.get(`${command.name}:${message.author.id}`);
						if (!timestamp) await redis.set(`${command.name}:${message.author.id}`, now, 'EX', command.cooldown);
					}
				};

				const isInCooldown = async (): Promise<boolean> => {
					if (command.cooldown) {
						const now = Date.now();
						const cooldownAmount = command.cooldown;
						const timestamp = await redis.get(`${command.name}:${message.author.id}`);
						if (timestamp) {
							const expirationTime = Number(timestamp) + cooldownAmount;
							if (now < expirationTime) {
								const timeLeft = expirationTime - now;
								const time = Math.floor((Date.now() + timeLeft) / seconds(1));
								await message.channel.send({ content: `You can rerun \`${command.name}\` <t:${time}:R>.` });
								return true;
							}
						}

						return false;
					}

					return false;
				};

				try {
					if (await isInCooldown()) return;
					metrics.commandInc(command.name);
					await command.run(message, args, updateCooldown);
					logger.info(`Command triggered by ${message.author.tag}`);
				} catch (error_) {
					const error = error_ as Error;
					logger.error(error, error.message);
					try {
						await message.reply({ content: error.message, components: [] });
					} catch (error__) {
						const error = error__ as Error;
						logger.error(error, error.message);
					}
				}
			}
		}
	}
}

export default MessageListener;
