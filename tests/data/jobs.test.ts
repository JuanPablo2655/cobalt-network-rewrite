import jobs from '../../src/data/jobs';

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
});
