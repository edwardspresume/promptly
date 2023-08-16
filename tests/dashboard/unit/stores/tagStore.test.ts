import { beforeEach, describe, expect, it } from 'vitest';

import { get } from 'svelte/store';

import defaultTags from '$dashboardData/defaultTags';
import { createTagsStore } from '$dashboardStores/tagStore';
import type { TagStore } from '$dashboardTypes/dashboardTypes';
import { LocalStorageKeys } from '$dashboardUtils/localStorage';
import { compareStrings } from '$dashboardUtils/sortItems';

describe('Tag Storage Functionality', () => {
    let tagsStore: TagStore;

    beforeEach(() => {
        tagsStore = createTagsStore(LocalStorageKeys.TAGS);
    });

    it('Initializes with default tags if local storage is empty', () => {
        const { allTags } = tagsStore;
        expect(get(allTags)).toEqual(defaultTags);
    });

    it('Creates a new tag', () => {
        const { allTags, createTag } = tagsStore;
        createTag('newTag');
        expect(get(allTags)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'newTag',
                }),
            ])
        );
    });

    it('Prevents creation of a new tag with an existing name', () => {
        const { createTag, doesTagExist } = tagsStore;

        createTag('newTag');
        expect(doesTagExist('newTag')).toBeTruthy();

        expect(() => createTag('newTag')).toThrowError(
            'Tag "newTag" already exists'
        );

        const matchingTags = get(tagsStore.allTags).filter(
            (tag) => tag.name === 'newTag'
        );

        expect(matchingTags.length).toBe(1);
    });

    it('Updates a tag', () => {
        const { allTags, renameTag, doesTagExist } = tagsStore;

        const oldTagName = get(allTags)[0]?.name;

        if (oldTagName) expect(doesTagExist(oldTagName)).toBeTruthy();

        const newTagName = 'updatedTag';
        renameTag(1, newTagName);
        expect(doesTagExist(newTagName)).toBeTruthy();

        expect(get(allTags)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    name: newTagName,
                }),
            ])
        );

        if (oldTagName) expect(doesTagExist(oldTagName)).toBeFalsy();
    });

    it('Prevents updating of a tag if the new name already exists', () => {
        const { createTag, renameTag, doesTagExist } = tagsStore;

        createTag('newTag');
        expect(doesTagExist('newTag')).toBeTruthy();

        expect(() => renameTag(1, 'newTag')).toThrowError(
            'Tag "newTag" already exists'
        );
    });

    it('Deletes a tag', () => {
        const { allTags, deleteTag, doesTagExist } = tagsStore;

        const tagNameToDelete = get(allTags)[0]?.name;

        deleteTag(1);

        expect(get(allTags)).not.toContainEqual(
            expect.objectContaining({ id: 1 })
        );

        if (tagNameToDelete) expect(doesTagExist(tagNameToDelete)).toBeFalsy();
    });

    it('Deletes all tags', () => {
        const { allTags, deleteAllTags } = tagsStore;

        deleteAllTags();

        expect(get(allTags)).toEqual([]);
    });

    it('Sets and clears a text filter', () => {
        const { setTextFilter, filteredTags, allTags } = tagsStore;

        setTextFilter('Programming & Technology');

        expect(get(filteredTags)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Programming & Technology',
                }),
            ])
        );

        setTextFilter('');
        expect(get(filteredTags)).toEqual(get(allTags));
    });

    it('Returns the correct total tag count', () => {
        const { totalTagCount, allTags, createTag } = tagsStore;

        expect(get(totalTagCount)).toBe(get(allTags).length);

        createTag('extraTag');

        expect(get(totalTagCount)).toBe(get(allTags).length);
    });

    it('Correctly sets sorting preference and reorders tags', () => {
        const { setSortingPreference, filteredTags } = tagsStore;

        // Test ascending order
        setSortingPreference('name:ascending');
        const sortedByNameAsc = [...get(filteredTags)].sort((a, b) =>
            compareStrings(a.name, b.name)
        );
        expect(get(filteredTags)).toEqual(sortedByNameAsc);

        // Test descending order
        setSortingPreference('name:descending');
        const sortedByNameDesc = [...get(filteredTags)].sort((a, b) =>
            compareStrings(b.name, a.name)
        );
        expect(get(filteredTags)).toEqual(sortedByNameDesc);

        // Test default order
        setSortingPreference('default:default');
        expect(get(filteredTags)).toEqual(get(tagsStore.allTags));
    });
});
