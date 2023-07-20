import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDarkModePreferenceStore } from '$stores/darkModePreferenceStore';
import { localStorageKeys } from '$utils/localStorage';

// Overriding the environment variable to force browser mode
vi.mock('$app/environment', () => ({ browser: true }));

describe('darkModePreferenceStore', () => {
    // Defining a mock for localStorage
    let mockLocalStorage: Record<string, string> = {};

    global.localStorage = {
        getItem: (key: string) => mockLocalStorage[key] ?? null,
        setItem: (key: string, value: string) =>
            (mockLocalStorage[key] = value),
        clear: () => (mockLocalStorage = {}),
        length: 0,
        key: vi.fn(),
        removeItem: vi.fn(),
    };

    afterEach(() => localStorage.clear());

    it('should return a store object when createDarkModePreferenceStore is called', () => {
        const store = createDarkModePreferenceStore(
            localStorageKeys.isDarkMode
        );

        // The created store should not be undefined
        expect(store).toBeDefined();
    });

    // Tests that the initial theme preference is retrieved from localStorage
    it('should correctly initialize the dark mode preference from localStorage', () => {
        // Setting initial dark mode preference to true in localStorage
        localStorage.setItem(localStorageKeys.isDarkMode, 'true');

        // Create a new dark mode preference store
        const darkModePreferenceStore = createDarkModePreferenceStore(
            localStorageKeys.isDarkMode
        );

        let currentDarkModePreference;

        darkModePreferenceStore?.currentDarkModePreference.subscribe(
            (val) => (currentDarkModePreference = val)
        );

        // The preference retrieved from the store should be equal to true
        expect(currentDarkModePreference).toBe(true);
    });

    it('should toggle dark mode preference correctly', () => {
        // First, we set the initial dark mode preference to 'true' in localStorage
        localStorage.setItem(localStorageKeys.isDarkMode, 'true');

        // Then we create a new dark mode preference store
        const darkModePreferenceStore = createDarkModePreferenceStore(
            localStorageKeys.isDarkMode
        );

        let currentDarkModePreference;
        // We subscribe to the currentDarkModePreference store. The callback function we pass to subscribe will
        // update the value of currentDarkModePreference whenever the store's value changes.
        darkModePreferenceStore?.currentDarkModePreference.subscribe(
            (val) => (currentDarkModePreference = val)
        );

        // We expect that the initial preference is true because we set it to 'true' in localStorage above
        expect(currentDarkModePreference).toBe(true);

        // Here, we call the toggleDarkMode function which should change the value of the dark mode preference
        darkModePreferenceStore?.toggleDarkMode();

        // Since we toggled the dark mode preference, which was initially 'true', we now expect it to be 'false'
        expect(currentDarkModePreference).toBe(false);
    });
});
