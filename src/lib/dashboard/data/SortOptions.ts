import type { SortOption } from '$dashboardTypes/dashboardTypes';

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
        announceMessage: `${type}s were sorted by ${label}`,
    };
}

// Array of sort options that are common to both tags and prompts
const dateSortOptions = [
    { label: 'Created: Newest', field: 'createdAt', direction: 'descending' },
    { label: 'Created: Oldest', field: 'createdAt', direction: 'ascending' },
    { label: 'Updated: Newest', field: 'updatedAt', direction: 'descending' },
    { label: 'Updated: Oldest', field: 'updatedAt', direction: 'ascending' },
];

// Generates and exports the list of tag sort options
export const tagSortOptions = [
    { label: 'Default', field: 'default', direction: 'default' },
    { label: 'Name: A-Z', field: 'name', direction: 'ascending' },
    { label: 'Name: Z-A', field: 'name', direction: 'descending' },
    ...dateSortOptions,
].map(({ label, field, direction }) =>
    createSortOption(label, 'Tag', field, direction)
);

// Generates and exports the list of prompt sort options
export const promptSortOptions = [
    { label: 'Default', field: 'default', direction: 'default' },
    {
        label: 'Favorites',
        field: 'favoriteStatus',
        direction: 'ascending',
    },
    { label: 'Title: A-Z', field: 'title', direction: 'ascending' },
    { label: 'Title: Z-A', field: 'title', direction: 'descending' },

    ...dateSortOptions,
].map(({ label, field, direction }) =>
    createSortOption(label, 'Prompt', field, direction)
);
