import { Counter, Gauge, collectDefaultMetrics } from 'prom-client';
import { CobaltClient } from '../struct/cobaltClient';

export default class Metrics {
	public messageCounter: Counter<string>;
	public eventCounter: Counter<string>;
	public uptime: Gauge<string>;
	public latency: Gauge<string>;
	public commandsExecuted: Counter<string>;
	cobalt: CobaltClient;
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
	}

	start() {
		this.uptime.startTimer();
		const ping = () => {
			this.latency.set(this.cobalt.ws.ping);
		};
		setInterval(ping, 15 * 1000); // 15s
	}
}
