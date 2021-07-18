import Event from '../../struct/Event';
import { InteractionRegistry } from '../../struct/registries/export/RegistryIndex';

abstract class ReadyEvent extends Event {
	constructor() {
		super({
			name: 'ready',
		});
	}

	async run() {
		this.cobalt.metrics.eventCounter.labels(this.name).inc();
		InteractionRegistry(this.cobalt);
		console.log('[Cobalt]\tOnline!');
	}
}

export default ReadyEvent;
