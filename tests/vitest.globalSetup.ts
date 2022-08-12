export async function teardown() {
	const { client } = await import('./mocks/MockInstances.js');

	client.destroy();
}
