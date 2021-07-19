import Event from '../../struct/Event';
import { InteractionRegistry } from '../../struct/registries/export/RegistryIndex';

abstract class ReadyEvent extends Event {
	constructor() {
		super({
			name: 'ready',
		});
	}

	async run() {
		this.cobalt.metrics.eventInc(this.name);
		InteractionRegistry(this.cobalt);
		console.log('[Cobalt]\tOnline!');
	}
}

export default ReadyEvent;
