import { browser } from '$app/environment';
import { get, type Writable } from 'svelte/store';

import defaultPrompts from '$dashboardData/defaultPrompts';
import defaultTags from '$dashboardData/defaultTags';

import { userPromptsStore } from '$dashboardStores/userPromptsStore';
import { allTagsStore } from '$dashboardStores/tagsStore';

import { logError, sanitizeContentOnClient } from '$globalUtils';
import { createDate } from './functions';

/**
 * An object containing the keys used to store values in localStorage
 */
export const LocalStorageKeys = {
	PROMPTS: 'prompts',
	TAGS: 'tags'
} as const;

export type LocalStorageKeyType = (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys];

interface Identifiable {
	id?: string;
}

/**
 * Retrieves items from local storage.
 * @param {string} storageKey - Key to retrieve from localStorage
 * @param {T[]} defaultValue - Default value if no value is found in localStorage or if an error occurs
 * @returns {T[]} Retrieved array or default value
 */
function getItemsFromLocalStorage<T>(storageKey: string, defaultValue: T[]): T[] {
	if (!browser) return defaultValue;

	try {
		const storedValue = localStorage.getItem(storageKey);
		return storedValue ? (JSON.parse(storedValue) as T[]) : defaultValue;
	} catch (error) {
		logError(error, 'Failed to retrieve item from localStorage', { storageKey, defaultValue });

		return defaultValue;
	}
}

/**
 * Updates the store and saves the items to local storage.
 * @param {Writable<T[]>} store - Svelte store to update
 * @param {(items: T[]) => T[]} updateFunction - Function to apply to the current store items
 * @param {string} storageKey - Key to use when saving to localStorage
 */
function updateStoreAndSaveToStorage<T>(
	store: Writable<T[]>,
	updateFunction: (items: T[]) => T[],
	storageKey: string
) {
	try {
		// Get and update items
		const updatedItems = updateFunction(get(store));
		store.set(updatedItems);
		localStorage.setItem(storageKey, JSON.stringify(updatedItems));
	} catch (error) {
		logError(error, 'Failed to update store', { storageKey, store, updateFunction });
	}
}

/**
 * Sanitizes all string properties of an object
 *
 * @param {Record<string, unknown>} obj - The object to sanitize
 * @returns {Record<string, unknown>} - A new object with sanitized string properties
 */
function sanitizeObjectStringProps(obj: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			typeof value === 'string' ? sanitizeContentOnClient(value) : value
		])
	);
}

/**
 * Creates a storage manager to handle operations on local storage.
 * @param {Writable<T[]>} store - Svelte store
 * @param {T[]} defaultItems - Default items
 * @param {LocalStorageKeyType} localStorageKey - Key for local storage
 * @returns Storage manager object with methods to manipulate local storage
 */
export function createStorageManager<T extends Identifiable>(
	store: Writable<T[]>,
	defaultItems: T[],
	localStorageKey: LocalStorageKeyType
) {
	return {
		getItems: (): T[] => getItemsFromLocalStorage(localStorageKey, defaultItems),

		addItem: (item: Partial<T>) => {
			const currentItems = get(store);
			let newUUID: string;

			// Generate a set of existing UUIDs to optimize the unique ID generation process
			const existingUUIDs = new Set(currentItems.map((item) => item.id));

			// Ensure unique ID
			do {
				newUUID = crypto.randomUUID();
			} while (existingUUIDs.has(newUUID));

			const sanitizedItem = sanitizeObjectStringProps(item) as Partial<T>;

			const newItem: Partial<T> = {
				id: newUUID,
				profileId: '0000000',
				...sanitizedItem,
				createdAt: createDate(),
				updatedAt: createDate()
			};

			updateStoreAndSaveToStorage(store, (items) => [newItem as T, ...items], localStorageKey);
		},

		updateItem: (id: string, updatedItem: Partial<T>) => {
			const sanitizedItem = sanitizeObjectStringProps(updatedItem);

			updateStoreAndSaveToStorage(
				store,
				(items) =>
					items.map((item) =>
						item.id !== id
							? item
							: {
									...item,
									...sanitizedItem,
									updatedAt: createDate()
							  }
					),
				localStorageKey
			);
		},

		deleteItem: (id: string) => {
			updateStoreAndSaveToStorage(
				store,
				(items) => items.filter((item) => item.id !== id),
				localStorageKey
			);
		},

		deleteAllItems: () => {
			updateStoreAndSaveToStorage(store, () => [], localStorageKey);
		}
	};
}

export const promptLocalStorageManager = createStorageManager(
	userPromptsStore,
	defaultPrompts,
	LocalStorageKeys.PROMPTS
);

export const tagLocalStorageManager = createStorageManager(
	allTagsStore,
	defaultTags,
	LocalStorageKeys.TAGS
);
