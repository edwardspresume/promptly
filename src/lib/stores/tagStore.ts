import { derived, get, writable } from 'svelte/store';

import defaultTags from '$data/defaultTags';

import type { TagSchema, TagStore } from '$types';

import {
    LocalStorageKeys,
    loadArrayFromLocalStorage,
    updateStoreAndSaveToStorage,
} from '$utils/localStorage';

import { createDate } from '$utils/functions';
import { sortItems } from '$utils/sortItems';

export function createTagsStore(
    localStorageKey: typeof LocalStorageKeys.TAGS
): TagStore {
    const existingTags = loadArrayFromLocalStorage(
        localStorageKey,
        defaultTags
    );

    const allTags = writable(existingTags);
    const textFilter = writable<string>('');
    const sortingPreference = writable<string>('');

    const totalTagCount = derived(allTags, (tags) => tags.length);

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

    const doesTagExist = (name: string) => {
        const normalizedName = name.trim().toLowerCase();

        const tags = get(allTags);

        return tags.some((tag) => tag.name.toLowerCase() === normalizedName);
    };

    const createTag = (name: string) => {
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

    const updateTag = (id: number, name: string) => {
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

    const deleteTag = (id: number) => {
        updateStoreAndSaveToStorage(
            allTags,
            (tags) => tags.filter((tag) => tag.id !== id),
            localStorageKey
        );
    };

    const deleteAllTags = () => {
        updateStoreAndSaveToStorage(allTags, () => [], localStorageKey);
    };

    const setTextFilter = (text: string) => textFilter.set(text);

    const setSortingPreference = (option: string) =>
        sortingPreference.set(option);

    return {
        allTags,
        filteredTags,
        totalTagCount,
        doesTagExist,
        createTag,
        updateTag,
        deleteTag,
        deleteAllTags,
        setTextFilter,
        setSortingPreference,
    };
}

const tagsStore = createTagsStore(LocalStorageKeys.TAGS);

export default tagsStore;
