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
	collectCoverageFrom: ['<rootDir>/src/lib/utils/util.ts', '<rootDir>/src/lib/data/**/*.ts'],
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
