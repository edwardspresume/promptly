import type { z } from 'zod';

import type { Readable, Writable } from 'svelte/store';

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

import type { PromptValidationSchema } from '$utils/validation/promptValidationSchema';
import type { TagValidationSchema } from '$utils/validation/tagValidationSchema';

export type ItemType = 'prompt' | 'tag';

export type PromptSchema = z.infer<typeof PromptValidationSchema>;
export type TagSchema = z.infer<typeof TagValidationSchema>;

export interface DarkModePreferenceStore {
    // Store holding the current dark mode preference
    currentPreference: Writable<boolean | null>;

    // Method to toggle the current dark mode preference
    toggleDarkMode: () => void;
}

export interface PromptStore {
    // Store holding all prompts
    allPrompts: Writable<PromptSchema[]>;

    // Store holding prompts after applying filters and sorting
    filteredPrompts: Readable<PromptSchema[]>;

    // Store holding the total count of prompts
    totalPromptCount: Readable<number>;

    // Methods to manage prompts
    createPrompt: (prompt: Partial<PromptSchema>) => void;
    updatePrompt: (id: number, updatedPrompt: Partial<PromptSchema>) => void;
    deletePrompt: (id: number) => void;
    deleteAllPrompts: () => void;
    toggleFavorite: (id: number) => void;

    // Methods to manage filters and sorting
    setTextFilter: (text: string) => void;
    setTagFilter: (tags: number[]) => void;
    setSortingPreference: (option: string) => void;
}

export interface TagStore {
    // Store holding all tags
    allTags: Writable<TagSchema[]>;

    // Store holding tags after applying filters and sorting
    filteredTags: Readable<TagSchema[]>;

    // Store holding the total count of tags
    totalTagCount: Readable<number>;

    // Methods to manage tags
    doesTagExist: (name: string) => boolean;
    createTag: (name: string) => void;
    renameTag: (id: number, name: string) => void;
    deleteTag: (id: number) => void;
    deleteAllTags: () => void;

    // Methods to manage filters and sorting
    setTextFilter: (text: string) => void;
    setSortingPreference: (option: string) => void;
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
