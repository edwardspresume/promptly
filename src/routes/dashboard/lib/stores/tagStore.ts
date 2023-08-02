import { derived, get, writable } from 'svelte/store';

import type { TagSchema, TagStore } from '$dashboardTypes';

import defaultTags from '$dashboardData/defaultTags';

import {
    LocalStorageKeys,
    loadArrayFromLocalStorage,
    updateStoreAndSaveToStorage,
} from '$dashboardUtils/localStorage';

import { createDate } from '$dashboardUtils/functions';
import { sortItems } from '$dashboardUtils/sortItems';

/**
 * This function creates a tags store using the specified local storage key.
 * It retrieves existing tags, provides methods for tag manipulation, and manages filtered and sorted tags.
 *
 * @param {LocalStorageKeys.TAGS} localStorageKey - the key used to retrieve and store tags data from/in local storage
 * @returns {TagStore} a tag store with various utility methods
 */
export function createTagsStore(
    localStorageKey: typeof LocalStorageKeys.TAGS
): TagStore {
    const initialTags = loadArrayFromLocalStorage(localStorageKey, defaultTags);

    const allTags = writable(initialTags);
    const textFilter = writable<string>('');
    const sortingPreference = writable<string>('');

    /**
     * Derives the total tag count from allTags
     @returns {number} the total tag count
     */
    const totalTagCount = derived(allTags, (tags) => tags.length);

    /**
     * Derives filtered and sorted tags based on filter text and sort option
     */
    const filteredTags = derived(
        [allTags, textFilter, sortingPreference],
        ([tags, filterText, sortOption]) => {
            const normalizedFilterText = filterText.toLowerCase();

            const filteredTags = tags.filter((tag) =>
                tag.name.toLowerCase().includes(normalizedFilterText)
            );

            return sortItems(filteredTags, sortOption);
        }
    );

    /**
     * Checks if a tag with a specific name exists in the list
     * @param {string} name The tag name to check
     * @returns {boolean} true if tag exists, false otherwise
     */
    const doesTagExist = (name: string) => {
        const normalizedName = name.trim().toLowerCase();

        const tags = get(allTags);

        return tags.some((tag) => tag.name.toLowerCase() === normalizedName);
    };

    /**
     * Creates a new tag with the specified name and adds it to the store
     * @param {string} name The name of the new tag
     */
    const createTag = (name: string) => {
        if (doesTagExist(name)) {
            throw new Error(`Tag "${name}" already exists`);
        }

        const tags = get(allTags);
        const maxId = Math.max(...tags.map((tag) => tag.id), 0);

        const newTag: TagSchema = {
            id: maxId + 1,
            name,
            createdAt: createDate(),
            updatedAt: createDate(),
        };

        updateStoreAndSaveToStorage(
            allTags,
            (tags) => [newTag, ...tags],
            localStorageKey
        );
    };

    /**
     * Updates a tag with the specified ID by setting its name and update timestamp
     * @param {number} id The id of the tag to update
     * @param {string} name The new name of the tag
     */
    const renameTag = (id: number, name: string) => {
        if (doesTagExist(name)) {
            throw new Error(`Tag "${name}" already exists`);
        }

        updateStoreAndSaveToStorage(
            allTags,
            (tags) =>
                tags.map((tag) =>
                    tag.id !== id
                        ? tag
                        : {
                              ...tag,
                              name,
                              updatedAt: createDate(),
                          }
                ),
            localStorageKey
        );
    };

    /**
     * Deletes a tag with the specified ID from the store
     * @param {number} id The id of the tag to delete
     */
    const deleteTag = (id: number) => {
        updateStoreAndSaveToStorage(
            allTags,
            (tags) => tags.filter((tag) => tag.id !== id),
            localStorageKey
        );
    };

    /**
     * Deletes all tags from the store
     */
    const deleteAllTags = () => {
        updateStoreAndSaveToStorage(allTags, () => [], localStorageKey);
    };

    /**
     * Sets the text filter to the specified text
     * @param {string} text - the text to set the filter to
     */
    const setTextFilter = (text: string) => textFilter.set(text);

    /**
     * Sets the sorting preference to the specified option
     * @param {string} option - the option to set the sorting preference to
     */
    const setSortingPreference = (option: string) =>
        sortingPreference.set(option);

    return {
        allTags,
        filteredTags,
        totalTagCount,
        doesTagExist,
        createTag,
        renameTag,
        deleteTag,
        deleteAllTags,
        setTextFilter,
        setSortingPreference,
    };
}

const tagsStore = createTagsStore(LocalStorageKeys.TAGS);

export default tagsStore;
