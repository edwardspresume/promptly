import type { SortableItemProperties } from '$dashboardTypes';

/**
 * A utility function to compare strings.
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns - A negative, zero, or positive number based on the comparison.
 */
export function compareStrings(a: string | undefined, b: string | undefined): number {
	if (typeof a === 'undefined' || typeof b === 'undefined') {
		if (a === b) return 0;
		else if (typeof a === 'undefined') return -1;
		else return 1;
	}

	// This regex matches emojis and spaces
	const emojiSpaceRegex = /\p{Extended_Pictographic}|\s/gu;

	// Remove emojis and spaces from the strings before comparing them
	const aClean = a.replace(emojiSpaceRegex, '');
	const bClean = b.replace(emojiSpaceRegex, '');

	return aClean.localeCompare(bClean);
}

/**
 * A utility function to compare dates.
 * @param {string | undefined} a - The first date to compare.
 * @param {string | undefined} b - The second date to compare.
 * @returns {number} - A negative, zero, or positive number based on the comparison.
 */
export function compareDate(a: string | undefined, b: string | undefined) {
	if (typeof a === 'undefined' || typeof b === 'undefined') {
		if (a === b) return 0;
		else if (typeof a === 'undefined') return -1;
		else return 1;
	}

	return Date.parse(a) - Date.parse(b);
}

/**
 * A utility function to compare boolean values.
 * @param {boolean | undefined} a - The first boolean value to compare.
 * @param {boolean | undefined} b - The second boolean value to compare.
 * @returns {number} - A negative, zero, or positive number based on the comparison.
 */
export const booleanComparator = (a: boolean | undefined, b: boolean | undefined): number => {
	if (typeof a === 'undefined' || typeof b === 'undefined') {
		if (a === b) return 0;
		else if (typeof a === 'undefined') return 1;
		else return -1;
	}

	return (b ? 1 : 0) - (a ? 1 : 0);
};

/**
 * A function that sorts an array of items that extend SortableItemProperties.
 * The sort is based on a provided sort option.
 * @param {T[]} items - The array of items to sort.
 * @param {string} selectedSortOption - The sort option to use. This should be a combination of the field to sort on and the sort direction, separated by a colon. For example, 'title:ascending'.
 * @returns {T[]} - The sorted array of items.
 */
export const sortItems = <T extends SortableItemProperties>(
	items: T[],
	selectedSortOption: string
): T[] => {
	const sortFunctions: Record<string, (a: T, b: T) => number> = {
		'': (a, b) => compareDate(b.updatedAt, a.updatedAt),
		'default:default': (a, b) => compareDate(b.updatedAt, a.updatedAt),

		'title:ascending': (a, b) => compareStrings(a.title, b.title),
		'title:descending': (a, b) => compareStrings(b.title, a.title),

		'name:ascending': (a, b) => compareStrings(a.name, b.name),
		'name:descending': (a, b) => compareStrings(b.name, a.name),

		'createdAt:ascending': (a, b) => compareDate(a.createdAt, b.createdAt),
		'createdAt:descending': (a, b) => compareDate(b.createdAt, a.createdAt),

		'updatedAt:ascending': (a, b) => compareDate(a.updatedAt, b.updatedAt),
		'updatedAt:descending': (a, b) => compareDate(b.updatedAt, a.updatedAt),

		'favoriteStatus:ascending': (a, b) => booleanComparator(a.isFavorited, b.isFavorited)
	};

	const sortFunction = sortFunctions[selectedSortOption];

	if (!sortFunction) {
		console.warn(`Invalid sort option: ${selectedSortOption}. Items are not sorted.`);
		return items;
	}

	return [...items].sort(sortFunction);
};
