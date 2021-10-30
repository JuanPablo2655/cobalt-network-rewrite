import jobs from '@lib/data/jobs';

describe('Jobs', () => {
	test("GIVEN 'developer' THEN return developer object", () => {
		expect(jobs.find(j => j.id === 'developer')).toEqual({
			id: 'developer',
			name: 'Developer',
			entries: ['**{user.username}** developed a program for a client and got paid **₡{money}**.'],
			firedEntry: '**{user.username}**  got fired for missing too many deadlines.',
			minAmount: 500,
		});
	});

	test("GIVE 'devleoper.minAmount' THEN return 500", () => {
		expect(jobs.find(j => j.id === 'developer')?.minAmount).toEqual(500);
	});

	test("GIVE 'random.minAmount' THEN return UNDEFINED", () => {
		expect(jobs.find(j => j.id === 'random')?.minAmount).toBeUndefined();
	});
});
