/**
 * Remove all the duplicates from an array
 * @param array The array that contains the duplicates
 * @returns A new array with no duplicates
 */
export function removeDuplicates<T>(array: T[]) {
	return [...new Set(array)];
}
