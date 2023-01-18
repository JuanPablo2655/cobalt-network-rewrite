import { setInterval } from 'node:timers';
import type { ClientEvents, Snowflake } from 'discord.js';
import express, { type Express } from 'express';
import { Counter, Gauge, collectDefaultMetrics, register } from 'prom-client';
import type { CobaltClient } from '../CobaltClient.js';
import { logger } from '#lib/structures';
import { seconds } from '#utils/common';

export default class Metrics {
	private readonly messageCounter: Counter<string>;

	private readonly messageGuildCounter: Counter<string>;

	private readonly voiceTimeCounter: Counter<string>;

	private readonly VoiceGuildTimeCounter: Counter<string>;

	private readonly eventCounter: Counter<string>;

	private readonly latency: Gauge<string>;

	private readonly commandsExecuted: Counter<string>;

	private readonly app: Express;

	public cobalt: CobaltClient;

	public server: import('http').Server;

	public constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
		collectDefaultMetrics({ prefix: 'cobalt_' });
		this.messageCounter = new Counter({ name: 'cobalt_messages_total', help: 'Total number of messages seen' });
		this.messageGuildCounter = new Counter({
			name: 'cobalt_messages',
			help: 'Total number of messages a guild has sent',
			labelNames: ['guild'],
		});
		this.voiceTimeCounter = new Counter({
			name: 'cobalt_voice_total',
			help: 'Total time users have spent in VC',
		});
		this.VoiceGuildTimeCounter = new Counter({
			name: 'cobalt_voice',
			help: 'Total time users have spent in VC each guild',
			labelNames: ['guild'],
		});
		this.eventCounter = new Counter({
			name: 'cobalt_events',
			help: 'Total amount of WebSocket events received from Discord',
			labelNames: ['event'],
		});
		this.commandsExecuted = new Counter({
			name: 'cobalt_commands',
			help: 'Number of command Cobaltia has successfully executed',
			labelNames: ['command'],
		});
		this.latency = new Gauge({ name: 'cobalt_latency', help: 'Websocket latency', labelNames: ['type'] });
		this.app = express();
	}

	/**
	 * Increment message count
	 *
	 * @param guildId - The guild Id
	 */
	public messageInc(guildId?: Snowflake): void {
		if (guildId) {
			this.messageGuildCounter.labels(guildId).inc();
			return;
		}

		this.messageCounter.inc();
	}

	/**
	 * Increment the event count
	 *
	 * @param event - The event
	 */
	public eventInc(event: keyof ClientEvents): void {
		this.eventCounter.labels(event).inc();
	}

	/**
	 * Increment time spent in vc
	 *
	 * @param elapsed - The time spent in vc
	 * @param guildId - The guild id
	 */
	public voiceInc(elapsed: number, guildId?: Snowflake): void {
		if (guildId) {
			this.VoiceGuildTimeCounter.labels(guildId).inc(elapsed);
			return;
		}

		this.voiceTimeCounter.inc(elapsed);
	}

	/**
	 * Increment the command usage
	 *
	 * @param command - The command name
	 */
	public commandInc(command: string): void {
		this.commandsExecuted.labels(command).inc();
	}

	/**
	 * Start the metric server
	 */
	public start() {
		const ping = () => {
			this.latency.labels('Websocket').set(this.cobalt.ws.ping);
		};

		setInterval(ping, seconds(15));

		this.app.get('/metrics', async (_, res) => {
			try {
				res.set('Content-Type', register.contentType);
				res.end(await register.metrics());
			} catch (error) {
				res.status(500).end(error);
			}
		});

		this.server = this.app.listen(3_030, () => logger.info(`Prometheus listening on port 3030!`));
	}
}
