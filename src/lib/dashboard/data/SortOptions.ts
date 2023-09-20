import type { SortOption } from '$dashboardTypes';

enum SortDirection {
	ASCENDING = 'ascending',
	DESCENDING = 'descending'
}

/**
 * Creates a sort option object.
 * @param {string} label - Label of the sort option
 * @param {string} type - Type of the sort (could be "Tag" or "Prompt")
 * @param {string} field - Field to sort on
 * @param {string} direction - Direction of the sort (could be "ascending" or "descending")
 * @returns {SortOption} - Returns the sort option object
 */
function createSortOption(
	label: string,
	type: string,
	field: string,
	direction: string
): SortOption {
	return {
		label,
		value: `${field}:${direction}`,
		announceMessage: `${type}s were sorted by ${label}`
	};
}

// Array of sort options that are common to both tags and prompts
const dateSortOptions = [
	{ label: 'Created: Newest', field: 'createdAt', direction: SortDirection.DESCENDING },
	{ label: 'Created: Oldest', field: 'createdAt', direction: SortDirection.ASCENDING },
	{ label: 'Updated: Newest', field: 'updatedAt', direction: SortDirection.DESCENDING },
	{ label: 'Updated: Oldest', field: 'updatedAt', direction: SortDirection.ASCENDING }
];

// Generates and exports the list of tag sort options
export const userTagSortOptions = [
	{ label: 'Name: A-Z', field: 'name', direction: SortDirection.ASCENDING },
	{ label: 'Name: Z-A', field: 'name', direction: SortDirection.DESCENDING },

	...dateSortOptions
].map(({ label, field, direction }) => createSortOption(label, 'Tag', field, direction));

// Generates and exports the list of prompt sort options
export const userPromptSortOptions = [
	{
		label: 'Favorites',
		field: 'favoriteStatus',
		direction: SortDirection.ASCENDING
	},
	{ label: 'Title: A-Z', field: 'title', direction: SortDirection.ASCENDING },
	{ label: 'Title: Z-A', field: 'title', direction: SortDirection.DESCENDING },

	...dateSortOptions
].map(({ label, field, direction }) => createSortOption(label, 'Prompt', field, direction));

export const communityPromptSortOptions = [
	{ label: 'Title: A-Z', field: 'title', direction: SortDirection.ASCENDING },
	{ label: 'Title: Z-A', field: 'title', direction: SortDirection.DESCENDING },

	...dateSortOptions
].map(({ label, field, direction }) => createSortOption(label, 'Prompt', field, direction));
