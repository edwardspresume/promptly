import { browser } from '$app/environment';

export const localStorageKeys = {
    isDarkMode: 'isDarkMode',
    prompts: 'prompts',
    tags: 'tags',
};

export const retrieveFromLocalStorage = <T>(
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
