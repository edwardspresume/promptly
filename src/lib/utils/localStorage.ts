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
 *
 * @param {string} storageKey - The key of the value to retrieve from localStorage
 * @param {T[]} defaultValue - The default value to return if the value is not found in localStorage or if an error occurs
 * @return {T[]} The array retrieved from localStorage, or the default value if the value is not found or if an error occurs
 */
export const loadArrayFromLocalStorage = <T>(
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
 *
 * @param {string} storageKey - The key to use when saving the value to localStorage
 * @param {T} value - The array to save to localStorage
 */
export const saveArrayToLocalStorage = <T>(
    storageKey: string,
    value: T
): void => {
    try {
        if (!browser) return;
        localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save item to localStorage:', error);
    }
};

/**
 * Updates a store and persists the new array to localStorage
 *
 * @param {Writable<T[]>} store - The store to update
 * @param {(items: T[]) => T[]} callback - A callback function that takes the current items in the store and returns the new items to be stored
 * @param {string} storageKey - The key to use when saving the new items to localStorage
 */
export const updateStoreAndSaveToStorage = <T>(
    store: Writable<T[]>,
    callback: (items: T[]) => T[],
    storageKey: string
) => {
    store.update((items) => {
        const newItems = callback(items);

        saveArrayToLocalStorage<T[]>(storageKey, newItems);
        return newItems;
    });
};
