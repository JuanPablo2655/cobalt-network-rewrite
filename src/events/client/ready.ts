import { logger } from '#lib/structures';
import { Event } from '#lib/structures/events';

abstract class ReadyEvent extends Event {
	constructor() {
		super({
			name: 'ready',
		});
	}

	async run() {
		this.cobalt.metrics.eventInc(this.name);
		logger.info('Online!');
	}
}

export default ReadyEvent;
