import { get } from 'svelte/store';

import type { TagSchema } from '$dashboardTypes';

import { createDate } from '$dashboardUtils/functions';
import {
    LocalStorageKeys,
    getItemsFromLocalStorage,
    updateStoreAndSaveToStorage,
} from '$dashboardUtils/localStorage';

import defaultTags from '$dashboardData/defaultTags';
import { allTagsStore } from '$dashboardStores/tagStore';

/**
 * Retrieves all tags from local storage.
 * @returns {TagSchema[]} An array of tags
 */
export const getTagsFromLocalStorage = () => {
    return getItemsFromLocalStorage(LocalStorageKeys.TAGS, defaultTags);
};

/**
 * Checks if a tag with a specific name exists in the list.
 * @param {string} tagName Name of the tag to check
 * @returns {boolean} true if tag exists, false otherwise
 */
export const doesTagExist = (tagName: string) => {
    const normalizedName = tagName.trim().toLowerCase();

    const currentTags = get(allTagsStore);

    return currentTags.some((tag) => tag.name.toLowerCase() === normalizedName);
};

/**
 * Creates a new tag with the specified name and adds it to the store.
 * @param {string} tagName Name of the new tag
 */
export const addTagToLocalStorage = (tagName: string) => {
    const currentTags = get(allTagsStore);

    // Generate a new UUID and check if it already exists
    let newUUID: string;

    do {
        newUUID = crypto.randomUUID();
    } while (currentTags.some((tag) => tag.id === newUUID));

    const newTag: TagSchema = {
        id: newUUID,
        name: tagName,
        createdAt: createDate(),
        updatedAt: createDate(),
    };

    updateStoreAndSaveToStorage(
        allTagsStore,
        (tags) => [newTag, ...tags],
        LocalStorageKeys.TAGS
    );
};

/**
 * Updates the name and update timestamp of a tag with the specified ID.
 * @param {string} tagId - The ID of the tag to update.
 * @param {string} newName - The new name of the tag.
 */
export const updateTagInLocalStorage = (tagId: string, newName: string) => {
    updateStoreAndSaveToStorage(
        allTagsStore,
        (tags) =>
            tags.map((tag) =>
                tag.id !== tagId
                    ? tag
                    : { ...tag, name: newName, updatedAt: createDate() }
            ),
        LocalStorageKeys.TAGS
    );
};

export const deleteTagFromLocalStorage = (tagId: string) => {
    updateStoreAndSaveToStorage(
        allTagsStore,
        (tags) => tags.filter((tag) => tag.id !== tagId),
        LocalStorageKeys.TAGS
    );
};

export const deleteAllTagsFromLocalStorage = () => {
    updateStoreAndSaveToStorage(allTagsStore, () => [], LocalStorageKeys.TAGS);
};

/**
 * Sends a request to delete a specific tag or all tags, based on the provided URL path and optional tagId.
 * @param {string} urlPath - URL path for the delete request.
 * @param {string | null} [tagId] - Optional tag ID for deleting a specific tag.
 * @returns {Promise<any>} - JSON response from the server.
 */
export async function deleteTagFromDatabaseRequest(
    urlPath: string,
    tagId?: string | null
) {
    try {
        const formData = new URLSearchParams();

        if (tagId) {
            formData.append('tagId', tagId);
        }

        const response = await fetch(urlPath, {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            },
        });

        return response.json();
    } catch (error) {
        console.error(`Error deleting tag: ${error}`);
    }
}
