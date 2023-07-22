import type { SortableItemProperties } from '$types';

/**
 * A utility function to compare strings.
 * @param {string | undefined} a - The first string to compare.
 * @param {string | undefined} b - The second string to compare.
 * @returns {number} - A negative, zero, or positive number based on the comparison.
 */
function stringComparator(a: string | undefined, b: string | undefined) {
    return (a ?? '').localeCompare(b ?? '');
}

/**
 * A utility function to compare dates.
 * @param {string | undefined} a - The first date to compare.
 * @param {string | undefined} b - The second date to compare.
 * @returns {number} - A negative, zero, or positive number based on the comparison.
 */
function dateComparator(a: string | undefined, b: string | undefined) {
    return Date.parse(a ?? '') - Date.parse(b ?? '');
}

/**
 * A utility function to compare boolean values.
 * @param {boolean | undefined} a - The first boolean value to compare.
 * @param {boolean | undefined} b - The second boolean value to compare.
 * @returns {number} - A negative, zero, or positive number based on the comparison.
 */
const booleanComparator = (a: boolean | undefined, b: boolean | undefined) =>
    (b ? 1 : 0) - (a ? 1 : 0);

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
        'title:ascending': (a, b) => stringComparator(a.title, b.title),
        'title:descending': (a, b) => stringComparator(b.title, a.title),

        'name:ascending': (a, b) => stringComparator(a.name, b.name),
        'name:descending': (a, b) => stringComparator(b.name, a.name),

        'createdAt:ascending': (a, b) =>
            dateComparator(a.createdAt, b.createdAt),
        'createdAt:descending': (a, b) =>
            dateComparator(b.createdAt, a.createdAt),

        'updatedAt:ascending': (a, b) =>
            dateComparator(a.updatedAt, b.updatedAt),
        'updatedAt:descending': (a, b) =>
            dateComparator(b.updatedAt, a.updatedAt),

        'favorite_status:descending': (a, b) =>
            booleanComparator(a.isFavorited, b.isFavorited),
    };

    const sortFunction = sortFunctions[selectedSortOption];
    
    if (!sortFunction) {
        console.warn(
            `Invalid sort option: ${selectedSortOption}. Items are not sorted.`
        );
        return items;
    }

    return [...items].sort(sortFunction);
};
