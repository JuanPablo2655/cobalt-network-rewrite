import { exec } from 'node:child_process';
import { inspect, promisify } from 'node:util';
import { type Message, type MessageReaction, type User, codeBlock } from 'discord.js';
import { GenericCommand } from '#lib/structures';

abstract class EvalCommand extends GenericCommand {
	public constructor() {
		super({
			name: 'eval',
			description: 'Eval raw code. Be careful of people who might want to gain access to the bot though this command!',
			category: 'dev',
			usage: '<code>',
			aliases: ['e'],
			devOnly: true,
		});
	}

	public async run(message: Message, args: string[], addCD: () => Promise<void>) {
		await addCD();
		// TODO(Isidro): refactor
		let evalued = 'undefined';
		switch (args[0]?.toLowerCase() ?? '') {
			case '-a': {
				if (!args[1]) return message.channel.send({ content: 'What do you want to evaluate?' });
				try {
					// eslint-disable-next-line no-eval
					evalued = await eval('(async() => {\n' + args.slice(1).join(' ') + '\n})();');
					evalued = inspect(evalued, { depth: 0 });
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					evalued = error instanceof Error ? error.toString() : 'Unknown Error';
				}

				break;
			}

			case '-sh': {
				if (!args[1]) return message.channel.send({ content: 'What should I run in the terminal?' });
				evalued = args.slice(1).join(' ');
				try {
					const { stdout, stderr } = await promisify(exec)(evalued);
					if (!stdout && !stderr)
						return await message.channel.send({ content: "I ran that but there's no nothing to show." });
					if (stdout) evalued = stdout;
					if (stderr) evalued = stderr;
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					evalued = error instanceof Error ? error.toString() : 'Unknown Error';
				}

				break;
			}

			default: {
				if (!args[0]) return message.channel.send({ content: 'What do you wanna evaluate?' });
				try {
					// eslint-disable-next-line no-eval
					evalued = await eval(args.join(' '));
					evalued = inspect(evalued, { depth: 0 });
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					evalued = error instanceof Error ? error.toString() : 'Unknown Error';
				}

				break;
			}
		}

		const msg = await message.channel.send({
			content: codeBlock(args[0]?.toLowerCase() === '-sh' ? 'sh' : 'js', evalued.slice(0, 1_950)),
		});

		try {
			const filter = (reaction: MessageReaction, user: User) =>
				reaction.emoji.name === '🔨' && user.id === message.author.id;
			await msg.react('🔨');
			await msg.awaitReactions({
				filter,
				time: 20_000,
				max: 1,
				errors: ['time'],
			});
			if (msg.deletable) await msg.delete();
		} catch {}
	}
}

export default EvalCommand;
