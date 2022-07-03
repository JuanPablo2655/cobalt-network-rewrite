import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: [
			{ find: '#utils', replacement: `${resolve('src/lib/utils')}` },
			{ find: '#lib', replacement: `${resolve('src/lib')}` },
			{ find: '#root', replacement: `${resolve('src')}` },
			{ find: '#mocks', replacement: `${resolve('tests/mocks')}` },
		],
	},
	esbuild: { format: 'esm' },
	test: {
		globals: true,
		coverage: {
			enabled: true,
			reporter: ['text', 'lcov', 'clover'],
			include: ['src/lib/utils/**/*.ts', 'src/lib/data/**/*.ts'],
			exclude: [
				resolve('tests'),
				resolve('src/lib/utils/Database.ts'),
				resolve('src/lib/utils/Economy.ts'),
				resolve('src/lib/utils/Experience.ts'),
				resolve('src/lib/utils/Metrics.ts'),
				resolve('src/lib/utils/constants.ts'),
				resolve('src/lib/utils/functions/permissions.ts'),
			],
		},
	},
});
