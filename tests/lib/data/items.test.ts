import { describe, test, expect } from 'vitest';
import {
	Items,
	isFood,
	isWeapon,
	isApparel,
	isPotion,
	isMaterial,
	isMisc,
	isMarket,
	Item,
	Enchant,
	EnchantType,
} from '#lib/data';

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

	test('GIVEN new Item THEN return correct object', () => {
		expect(new Item('testId', 'test', 'test description', new Enchant(EnchantType.Fire, 10))).toEqual({
			id: 'testId',
			name: 'test',
			description: 'test description',
			data: {
				enchant: {
					type: 0,
					amount: 10,
				},
			},
		});
	});

	describe('types', () => {
		test("GIVEN 'readapple' THEN return true if obj is Food", () => {
			expect(isFood(Items.find(i => i.id === 'redapple')!.data)).toBe(true);
		});

		test("GIVEN 'redapple' THEN return false if obj isn't Weapon", () => {
			expect(isWeapon(Items.find(i => i.id === 'redapple')!.data)).toBe(false);
		});

		test("GIVEN 'tunic' THEN return true if obj is Apparel", () => {
			expect(isApparel(Items.find(i => i.id === 'tunic')!.data)).toBe(true);
		});

		test("GIVEN 'health' THEN return true if obj is Potion", () => {
			expect(isPotion(Items.find(i => i.id === 'health')!.data)).toBe(true);
		});

		test("GIVEN 'rawiron' THEN return true if obj is Material", () => {
			expect(isMaterial(Items.find(i => i.id === 'rawiron')!.data)).toBe(true);
		});

		test("GIVEN 'bearpelt' THEN return true if obj is Misc", () => {
			expect(isMisc(Items.find(i => i.id === 'bearpelt')!.data)).toBe(true);
		});

		test("GIVEN 'bearpelt' THEN return true if obj is Market", () => {
			expect(isMarket(Items.find(i => i.id === 'bearpelt')!.data)).toBe(true);
		});
	});
});
