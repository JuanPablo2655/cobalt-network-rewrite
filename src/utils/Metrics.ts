import express, { Express } from 'express';
import { Counter, Gauge, collectDefaultMetrics, register } from 'prom-client';
import { CobaltClient } from '../struct/cobaltClient';

export default class Metrics {
	public messageCounter: Counter<string>;
	public messageGuildCounter: Counter<string>;
	public voiceTimeCounter: Counter<string>;
	public VoiceGuildTimeCounter: Counter<string>;
	public eventCounter: Counter<string>;
	public uptime: Gauge<string>;
	public latency: Gauge<string>;
	public commandsExecuted: Counter<string>;
	public app: Express;
	public cobalt: CobaltClient;
	public server: import('http').Server;
	timer: (labels?: Partial<Record<string, string | number>> | undefined) => void;
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
		this.uptime = new Gauge({ name: 'cobalt_uptime', help: 'Cobaltia uptime' });
		this.commandsExecuted = new Counter({
			name: 'cobalt_commands',
			help: 'Number of command Cobaltia has successfully excuted',
			labelNames: ['command'],
		});
		this.latency = new Gauge({ name: 'cobalt_latency', help: 'Websocket latency' });
		this.app = express();
	}

	start() {
		this.uptime.setToCurrentTime();
		this.timer = this.uptime.startTimer();
		const ping = () => {
			this.latency.set(this.cobalt.ws.ping);
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

		this.server = this.app.listen(3000, () => console.log(`[Prometheus]\tListening on port 3000!`));
	}
}
