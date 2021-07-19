import { ClientEvents, Snowflake } from 'discord.js';
import express, { Express } from 'express';
import { Counter, Gauge, collectDefaultMetrics, register } from 'prom-client';
import { CobaltClient } from '../struct/cobaltClient';

export default class Metrics {
	private messageCounter: Counter<string>;
	private messageGuildCounter: Counter<string>;
	private voiceTimeCounter: Counter<string>;
	private VoiceGuildTimeCounter: Counter<string>;
	private eventCounter: Counter<string>;
	private latency: Gauge<string>;
	private commandsExecuted: Counter<string>;
	private app: Express;
	public cobalt: CobaltClient;
	public server: import('http').Server;
	constructor(cobalt: CobaltClient) {
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
			help: 'Number of command Cobaltia has successfully excuted',
			labelNames: ['command'],
		});
		this.latency = new Gauge({ name: 'cobalt_latency', help: 'Websocket latency', labelNames: ['type'] });
		this.app = express();
	}

	messageInc(guildId?: Snowflake) {
		if (guildId) return this.messageGuildCounter.labels(guildId).inc;
		return this.messageCounter.inc();
	}

	eventInc(event: keyof ClientEvents): void {
		return this.eventCounter.labels(event).inc();
	}

	voiceInc(elapsed: number, guildId?: Snowflake): void {
		if (guildId) return this.VoiceGuildTimeCounter.labels(guildId).inc(elapsed);
		return this.voiceTimeCounter.inc(elapsed);
	}

	commandInc(command: string): void {
		return this.commandsExecuted.labels(command).inc();
	}

	start() {
		const ping = () => {
			this.latency.labels('Websocket').set(this.cobalt.ws.ping);
		};
		setInterval(ping, 15 * 1000); // 15s

		this.app.get('/metrics', async (_, res) => {
			try {
				res.set('Content-Type', register.contentType);
				res.end(await register.metrics());
			} catch (err) {
				res.status(500).end(err);
			}
		});

		this.server = this.app.listen(3030, () => console.log(`[Prometheus]\tListening on port 3030!`));
	}
}
