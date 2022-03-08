import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class ReadyListener extends Listener {
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

export default ReadyListener;
