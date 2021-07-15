import express, { Express } from 'express';
import { Counter, Gauge, collectDefaultMetrics, register } from 'prom-client';
import { CobaltClient } from '../struct/cobaltClient';

export default class Metrics {
	public messageCounter: Counter<string>;
	public eventCounter: Counter<string>;
	public uptime: Gauge<string>;
	public latency: Gauge<string>;
	public commandsExecuted: Counter<string>;
	public app: Express;
	public cobalt: CobaltClient;
	server: import('http').Server;
	constructor(cobalt: CobaltClient) {
		this.cobalt = cobalt;
		collectDefaultMetrics({ prefix: 'cobalt_' });
		this.messageCounter = new Counter({ name: 'cobalt_message_total', help: 'Total number of messages seen' });
		this.eventCounter = new Counter({
			name: 'cobalt_event_total',
			help: 'Total amount of WebSocket events received from Discord',
			labelNames: ['event'],
		});
		this.uptime = new Gauge({ name: 'cobalt_uptime', help: 'Cobaltia uptime' });
		this.commandsExecuted = new Counter({
			name: 'cobalt_commands_excuted',
			help: 'Number of command Cobaltia has successfully excuted',
		});
		this.latency = new Gauge({ name: 'cobalt_latency', help: 'Websocket latency' });
		this.app = express();
	}

	start() {
		this.uptime.startTimer();
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
