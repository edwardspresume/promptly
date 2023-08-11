import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

/**
 * An object containing the keys used to store values in localStorage
 */
export const LocalStorageKeys = {
    IS_DARK_MODE: 'isDarkMode',
    PROMPTS: 'prompts',
    TAGS: 'tags',
};

/**
 * Loads an array of items from local storage.
 * @param {string} storageKey Key to retrieve from localStorage
 * @param {T[]} defaultValue Default value if no value is found in localStorage or if an error occurs
 * @return {T[]} Retrieved array or default value
 */
export const loadItemsFromLocalStorage = <T>(
    storageKey: string,
    defaultValue: T[]
): T[] => {
    try {
        if (!browser) return defaultValue;

        const storedValue = localStorage.getItem(storageKey);

        if (storedValue === null) return defaultValue;

        return JSON.parse(storedValue) as T[];
    } catch (error) {
        console.error('Failed to retrieve item from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Saves an array of items to local storage.
 * @param {string} storageKey Key to use when saving to localStorage
 * @param {T[]} value - Array to save to localStorage
 */
export const saveItemsToLocalStorage = <T>(
    storageKey: string,
    value: T[]
): void => {
    try {
        if (!browser) return;
        localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save item to localStorage:', error);
    }
};

/**
 * Updates a store and persists the new array to localStorage.
 * @param {Writable<T[]>} store Store to update
 * @param {(items: T[]) => T[]} callback Function to update items
 * @param {string} storageKey Key to save new items to localStorage
 */
export const updateStoreAndSaveToStorage = <T>(
    store: Writable<T[]>,
    callback: (items: T[]) => T[],
    storageKey: string
) => {
    store.update((items) => {
        const newItems = callback(items);

        saveItemsToLocalStorage<T[]>(storageKey, newItems);
        return newItems;
    });
};
