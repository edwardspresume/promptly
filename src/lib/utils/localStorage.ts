import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

export const localStorageKeyNames = {
    isDarkMode: 'isDarkMode',
    prompts: 'prompts',
    tags: 'tags',
};

/**
 * Retrieve a JSON object from local storage.
 *
 * @param {string} storageKey - The key under which the data is stored.
 * @param {T[]} defaultValue - The default value to return if no data is found.
 * @return {T[]} The retrieved object from local storage, or the default value.
 */
export const loadArrayFromLocalStorage = <T>(
    storageKey: string,
    defaultValue: T[]
): T[] => {
    try {
        if (!browser) return defaultValue;

        const localStorageValue = localStorage.getItem(storageKey);

        if (localStorageValue === null) return defaultValue;

        return JSON.parse(localStorageValue) as T[];
    } catch (error) {
        console.error('Failed to retrieve item from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Save a JSON object to local storage.
 *
 * @param {string} key - The key under which to store the data.
 * @param {T} value - The value to store.
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
 * Updates a store and persists the update to local storage.
 *
 * @param {Writable<T[]>} store - The store to update.
 * @param {(items: T[]) => T[]} callback - The update function.
 * @param {string} storageKey - The key under which to store the data.
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
