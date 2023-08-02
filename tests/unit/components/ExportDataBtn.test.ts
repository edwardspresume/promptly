import { JSDOM } from 'jsdom';
import * as store from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import promptsStore from '$dashboardStores/promptsStore';
import tagsStore from '$dashboardStores/tagStore';

import {
    downloadData,
    exportPromptsAndTagsData,
    prepareDataForExport,
} from '$dashboardComponents/AppHeader/ExportDataBtn.svelte';

let getSpy: any;
let downloadLinkSpy: any;
let consoleErrorSpy: any;

beforeEach(() => {
    const { window } = new JSDOM();
    global.document = window.document;

    // Create spies before each test
    getSpy = vi.spyOn(store, 'get');
    downloadLinkSpy = vi.spyOn(window.HTMLAnchorElement.prototype, 'click');
    consoleErrorSpy = vi.spyOn(console, 'error');
});

afterEach(() => {
    // Restore spies and remove created link elements after each test
    getSpy.mockRestore();
    downloadLinkSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    document.querySelectorAll('a').forEach((a) => a.remove());
});

describe('prepareDataForExport', () => {
    it('should successfully prepare prompts and tags data for export', () => {
        // Set up mock data and functions
        const mockPrompts = [
            {
                id: 1,
                title: 'Test prompt',
                text: 'Test text',
                isFavorited: false,
                tagIds: [1, 2],
            },
        ];

        const mockTags = [{ id: 1, name: 'Test tag' }];

        getSpy.mockImplementation(
            (
                store: typeof promptsStore.allPrompts | typeof tagsStore.allTags
            ) => {
                if (store === promptsStore.allPrompts) return mockPrompts;
                if (store === tagsStore.allTags) return mockTags;
            }
        );

        // Mock Blob and URL.createObjectURL
        global.Blob = vi.fn();
        global.URL.createObjectURL = vi.fn(() => 'mockURL');

        // Call the function to test
        const result = prepareDataForExport();

        expect(getSpy).toHaveBeenCalledWith(promptsStore.allPrompts);
        expect(getSpy).toHaveBeenCalledWith(tagsStore.allTags);
        expect(Blob).toHaveBeenCalledWith(
            [JSON.stringify({ prompts: mockPrompts, tags: mockTags })],
            { type: 'application/json' }
        );
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(result).toBe('mockURL');
    });
});

describe('downloadData', () => {
    it('should create a link and set correct properties', () => {
        downloadData('mockUrl');

        expect(downloadLinkSpy).toHaveBeenCalled();

        const createdLink = document.querySelector('a');
        expect(createdLink).not.toBeNull();
        expect(createdLink?.href).toBe('mockUrl');
        expect(createdLink?.download).toBe('promptly-data.json');
        expect(createdLink?.getAttribute('aria-hidden')).toBe('true');
    });
});

describe('exportPromptsAndTagsData', () => {
    it('should log error when there is an issue with exporting data', () => {
        const error = new Error('Test error');
        getSpy.mockImplementation(() => {
            throw error;
        });

        exportPromptsAndTagsData();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Something went wrong while exporting data:',
            error
        );
    });
});
