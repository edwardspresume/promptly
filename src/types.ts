import type { z } from 'zod';

import type { Readable, Writable } from 'svelte/store';

import type PromptValidationSchema from '$utils/validation/promptValidationSchema';
import type TagValidationSchema from '$utils/validation/tagValidationSchema';

export type PromptSchema = z.infer<typeof PromptValidationSchema>;
export type TagSchema = z.infer<typeof TagValidationSchema>;

export interface DarkModePreferenceStore {
    // Store holding the current dark mode preference
    currentPreference: Writable<boolean | null>;

    // Method to toggle the current dark mode preference
    toggleDarkMode: () => void;
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
    updateTag: (id: number, name: string) => void;
    deleteTag: (id: number) => void;
    deleteAllTags: () => void;

    // Methods to manage filters and sorting
    setTextFilter: (text: string) => void;
    setSortingPreference: (option: string) => void;
}
