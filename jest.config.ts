import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
	coverageProvider: 'v8',
	displayName: 'unit test',
	preset: 'ts-jest',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
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
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json',
		},
	},
});
