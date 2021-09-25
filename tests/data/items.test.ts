import { Items } from '../../src/data/items';

describe('Items', () => {
	test("GIVEN 'redapple' THEN return red Apple Object", () => {
		expect(Items.find(i => i.id === 'redapple')).toEqual({
			id: 'redapple',
			name: 'Red Apple',
			description: 'An edible and tasty fruit.',
			data: {
				food: { saturation: 2 },
				market: { price: 10, sellAmount: 4 },
			},
		});
	});
});
