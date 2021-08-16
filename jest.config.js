module.exports = {
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 70,
			lines: 70,
			statements: 70,
		},
	},
	roots: ['<rootDir>/src/'],
};
