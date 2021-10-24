import { Event } from '../../lib/structures/events';

abstract class ReadyEvent extends Event {
	constructor() {
		super({
			name: 'ready',
		});
	}

	async run() {
		this.cobalt.metrics.eventInc(this.name);
		console.log('[Cobalt]\tOnline!');
	}
}

export default ReadyEvent;
