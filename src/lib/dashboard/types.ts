import type { z } from 'zod';

import type { Writable } from 'svelte/store';

export type EnterKeyHint =
    | 'search'
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'send'
    | null
    | undefined;

import type { PromptValidationSchema } from '$dashboardUtils/validation/promptValidationSchema';
import type { TagValidationSchema } from '$dashboardUtils/validation/tagValidationSchema';

export type ItemType = 'prompt' | 'tag';

export type PromptSchema = z.infer<typeof PromptValidationSchema>;
export type TagSchema = z.infer<typeof TagValidationSchema>;

export interface DarkModePreferenceStore {
    // Store holding the current dark mode preference
    currentPreference: Writable<boolean | null>;

    // Method to toggle the current dark mode preference
    toggleDarkMode: () => void;
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

export interface ConfirmationInfo {
    title: string;
    toastMessage: string;
    callback: () => void;
}
