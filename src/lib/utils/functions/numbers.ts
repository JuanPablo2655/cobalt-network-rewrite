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

/**
 * Add a multiplier to an amount
 * @param amount The amount to add the multiplier to
 * @param multi The multiplier
 * @returns Amount plus multi
 */
export function addMulti(amount: number, multi: number) {
	return Math.round(amount + amount * (multi / 100));
}
