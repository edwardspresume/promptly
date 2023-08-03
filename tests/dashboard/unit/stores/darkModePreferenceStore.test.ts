import { describe, expect, it, vi } from 'vitest';

import { createDarkModePreferenceStore } from '$dashboardStores/darkModePreferenceStore';
import { LocalStorageKeys } from '$dashboardUtils/localStorage';

// Overriding the environment variable to force browser mode
vi.mock('$app/environment', () => ({ browser: true }));

describe('darkModePreferenceStore', () => {
    it('should return a store object when createDarkModePreferenceStore is called', () => {
        // The created store should not be undefined
        expect(
            createDarkModePreferenceStore(LocalStorageKeys.IS_DARK_MODE)
        ).toBeDefined();
    });

    it('should correctly initialize the dark mode preference from localStorage', () => {
        // Setting initial dark mode preference to true in localStorage
        localStorage.setItem(LocalStorageKeys.IS_DARK_MODE, 'true');

        // Create a new dark mode preference store
        const darkModePreferenceStore = createDarkModePreferenceStore(
            LocalStorageKeys.IS_DARK_MODE
        );

        let currentDarkModePreference;

        darkModePreferenceStore?.currentPreference.subscribe(
            (val) => (currentDarkModePreference = val)
        );

        // The preference retrieved from the store should be equal to true
        expect(currentDarkModePreference).toBe(true);
    });

    it('should toggle dark mode preference correctly', () => {
        // First, we set the initial dark mode preference to 'true' in localStorage
        localStorage.setItem(LocalStorageKeys.IS_DARK_MODE, 'true');

        // Then we create a new dark mode preference store
        const darkModePreferenceStore = createDarkModePreferenceStore(
            LocalStorageKeys.IS_DARK_MODE
        );

        let currentDarkModePreference;
        // We subscribe to the currentPreference store. The callback function we pass to subscribe will
        // update the value of currentDarkModePreference whenever the store's value changes.
        darkModePreferenceStore?.currentPreference.subscribe(
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
