import { writable } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    loadItemsFromLocalStorage,
    LocalStorageKeys,
    saveItemsToLocalStorage,
    updateStoreAndSaveToStorage,
} from '$dashboardUtils/localStorage';

// Overriding the environment variable to force browser mode
vi.mock('$app/environment', () => ({ browser: true }));

describe('localStorage functions', () => {
    let testKey: string;
    let testData: number[];
    let defaultValue: number[];

    beforeEach(() => {
        testKey = LocalStorageKeys.PROMPTS;
        testData = [1, 2, 3];
        defaultValue = [4, 5, 6];
    });

    it('should save and load data to/from localStorage', () => {
        saveItemsToLocalStorage(testKey, testData);

        const loadedData = loadItemsFromLocalStorage(testKey, []);

        expect(loadedData).toEqual(testData);
    });

    it('should return default value if key does not exist in localStorage', () => {
        const loadedData = loadItemsFromLocalStorage(
            'nonExistingKey',
            defaultValue
        );

        expect(loadedData).toEqual(defaultValue);
    });

    it('should update store and persist the update to local storage', () => {
        const store = writable([1, 2, 3]);
        const newValue = [4, 5, 6];

        updateStoreAndSaveToStorage(store, () => newValue, testKey);

        // Check that the store was updated
        store.subscribe((value) => {
            expect(value).toEqual(newValue);
        });

        // Check that the value was saved to localStorage
        const loadedData = loadItemsFromLocalStorage(testKey, []);
        expect(loadedData).toEqual(newValue);
    });

    it('should execute the callback function when updating store and saving to local storage', () => {
        const store = writable(testData);
        const callback = vi.fn(() => defaultValue);

        updateStoreAndSaveToStorage(store, callback, testKey);

        expect(callback).toHaveBeenCalled();
    });
});
