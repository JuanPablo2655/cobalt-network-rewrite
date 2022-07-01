import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
	esbuild: { format: 'esm' },
	test: {
		globals: true,
		coverage: {
			enabled: true,
			reporter: ['text', 'lcov', 'clover'],
			include: ['./src/lib/utils/**/*.ts', './src/lib/data/**/*.ts'],
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
	plugins: [nodeResolve()],
});
