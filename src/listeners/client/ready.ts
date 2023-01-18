import { logger } from '#lib/structures';
import { Listener } from '#lib/structures/listeners';

abstract class ReadyListener extends Listener {
	public constructor() {
		super({
			name: 'ready',
		});
	}

	public async run() {
		logger.info('Online!');
	}
}

export default ReadyListener;
