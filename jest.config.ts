import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
	coverageProvider: 'v8',
	displayName: 'unit test',
	preset: 'ts-jest',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	moduleNameMapper: {
		'^#utils/(.*)$': '<rootDir>/src/lib/utils/$1',
		'^#lib/(.*)$': '<rootDir>/src/lib/$1',
		'^#root/(.*)$': '<rootDir>/src/$1',
		'^#mocks/(.*)$': '<rootDir>/tests/mocks/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
	testEnvironment: 'node',
	collectCoverage: true,
	testPathIgnorePatterns: [
		'<rootDir>/src/lib/utils/Database.ts',
		'<rootDir>/src/lib/utils/Economy.ts',
		'<rootDir>/src/lib/utils/Experience.ts',
		'<rootDir>/src/lib/utils/Metrics.ts',
		'<rootDir>/src/lib/utils/constants.ts',
	],
	collectCoverageFrom: ['<rootDir>/src/lib/utils/**/*.ts', '<rootDir>/src/lib/data/**/*.ts'],
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
