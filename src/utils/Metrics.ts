import { Counter, Gauge, collectDefaultMetrics } from 'prom-client';

export default class Metrics {
	public messageCounter: Counter<string>;
	public eventCounter: Counter<string>;
	public uptime: Gauge<string>;
	public commandsExecuted: Counter<string>;
	constructor() {
		collectDefaultMetrics({ prefix: 'cobalt_' });
		this.messageCounter = new Counter({ name: 'cobalt_message_total', help: 'Total number of messages seen' });
		this.eventCounter = new Counter({
			name: 'cobalt_event_total',
			help: 'Total amount of WebSocket events received from Discord',
		});
		this.uptime = new Gauge({ name: 'cobalt_uptime', help: 'Cobaltia uptime' });
		this.commandsExecuted = new Counter({
			name: 'cobalt_commands_excuted',
			help: 'Number of command Cobatia has successfully excuted',
		});
	}

	start() {
		this.uptime.startTimer();
	}
}
