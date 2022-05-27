import { Listener } from '#lib/structures';

abstract class MockListener extends Listener {
	constructor() {
		super({
			// @ts-expect-error: testing stucture
			name: 'test',
		});
	}

	async run() {
		return;
	}
}

export default MockListener;
