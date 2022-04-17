/**
 * Format a number
 * @param n The number to format
 */
export function formatNumber(n: string | number): string | null {
	const number = Number.parseFloat(String(n)).toLocaleString('en-US');
	return number !== 'NaN' ? number : null;
}

/**
 * Format a number to currency format
 * @param n The number to format
 */
export function formatMoney(n: string | number): string | null {
	return formatNumber(n) !== null ? `₡ ${formatNumber(n)}` : null;
}
