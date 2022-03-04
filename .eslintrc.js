module.exports = {
	extends: ['eslint:recommended', 'prettier', 'plugin:@typescript-eslint/recommended'],
	env: {
		node: true,
		es2021: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'no-constructor-return': 'error',
		'arrow-spacing': ['warn', { before: true, after: true }],
		'no-duplicate-imports': ['error', { includeExports: true }],
		'no-var': 'error',
		'no-compare-neg-zero': 'error',
		'no-template-curly-in-string': 'error',
		'no-unsafe-negation': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-var-requires': 'warn',
		yoda: 'error',
		'no-restricted-globals': [
			'error',
			{
				name: 'Buffer',
				message: 'Import Buffer from `node:buffer` instead',
			},
			{
				name: 'process',
				message: 'Import process from `node:process` instead',
			},
			{
				name: 'setTimeout',
				message: 'Import setTimeout from `node:timers` instead',
			},
			{
				name: 'setInterval',
				message: 'Import setInterval from `node:timers` instead',
			},
			{
				name: 'setImmediate',
				message: 'Import setImmediate from `node:timers` instead',
			},
			{
				name: 'clearTimeout',
				message: 'Import clearTimeout from `node:timers` instead',
			},
			{
				name: 'clearInterval',
				message: 'Import clearInterval from `node:timers` instead',
			},
		],
	},
};
