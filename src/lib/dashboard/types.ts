export type ItemType = 'prompt' | 'tag';

/**
 * Interface for sortable item properties.
 * It's utilized for sorting both prompts and tags on a page.
 */
export interface SortableItemProperties {
	title?: string;
	name?: string;
	isFavorited?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Defines the structure of a sort option. Each sort option has a label, a value,
 * and an announcement message that is used to inform the user about the sorting action.
 */
export interface SortOption {
	label: string;
	value: string;
	announceMessage: string;
}

export interface ConfirmationInfo {
	heading: string;
	subheading: string;
	toastMessage: string;
	callback: () => void;
}
