import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

import type { DarkModePreferenceStore } from '$dashboardTypes/dashboardTypes';

/**
 * Creates a store for managing theme preferences.
 *
 * @param darkModePreferenceKey - Local storage key for dark mode setting
 * @returns An object containing the current dark mode preference store and a toggleDarkMode function
 */
export const createDarkModePreferenceStore = (
    darkModePreferenceKey: string
): DarkModePreferenceStore | undefined => {
    if (!browser) return;

    const darkModeStore: Writable<boolean | null> = writable(null);

    try {
        // Retrieve the initial dark mode preference from localStorage
        const storedThemePreference = JSON.parse(
            localStorage.getItem(darkModePreferenceKey) ?? 'null'
        ) as boolean | null;

        // Default to system dark mode preference if no user preference is found
        const isDarkModeEnabled =
            storedThemePreference ??
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set the initial dark mode preference in the store
        darkModeStore.set(isDarkModeEnabled);
    } catch (error) {
        console.error('Failed to retrieve item from localStorage:', error);
    }

    /**
     * Toggles the current dark mode preference in the store and updates the corresponding localStorage value
     */
    const toggleDarkMode = () => {
        darkModeStore.update((currentPreference) => {
            try {
                const newPreference = !currentPreference;
                // Update the dark mode preference in localStorage

                localStorage.setItem(
                    darkModePreferenceKey,
                    JSON.stringify(newPreference)
                );

                return newPreference;
            } catch (error) {
                console.error('Failed to update item in localStorage:', error);
                return currentPreference;
            }
        });
    };

    return {
        currentPreference: darkModeStore,
        toggleDarkMode,
    };
};

export const darkModePreferenceStore =
    createDarkModePreferenceStore('isDarkMode');
