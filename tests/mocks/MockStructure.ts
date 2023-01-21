import { Listener } from '#lib/structures';

abstract class MockListener extends Listener {
	public constructor() {
		super({
			// @ts-expect-error: testing structure
			name: 'test',
		});
	}

	public async run() {}
}

export default MockListener;
