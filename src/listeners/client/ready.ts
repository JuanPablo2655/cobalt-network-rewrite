import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class ReadyListener extends Listener {
	constructor() {
		super({
			name: 'ready',
		});
	}

	async run() {
		logger.info('Online!');
	}
}

export default ReadyListener;
