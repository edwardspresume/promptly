<script context="module" lang="ts">
    import promptsStore from '$dashboardStores/promptsStore';
    import tagsStore from '$dashboardStores/tagStore';
    import { get } from 'svelte/store';

    import Icon from '$dashboardComponents/General/Icon.svelte';

    /**
     * Function to prepare data for export, creating a downloadable JSON file
     * containing data from the 'prompts' and 'tags' stores.
     * @returns {string} downloadUrl - The URL of the downloadable JSON file
     */
    export function prepareDataForExport() {
        // Retrieve prompts and tags data from the store
        const prompts = get(promptsStore.allPrompts);
        const tags = get(tagsStore.allTags);

        // Combine the data into a single object
        const exportData = { prompts, tags };

        // Create a Blob object from the JSON string
        const exportBlob = new Blob([JSON.stringify(exportData)], {
            type: 'application/json',
        });

        // Create a URL for the Blob object
        const downloadUrl = URL.createObjectURL(exportBlob);

        return downloadUrl;
    }

    /**
     * Function to handle the download of exported data.
     * @param {string} url - The URL of the exported data
     */
    export function downloadData(url: string) {
        // Create a temporary downloadable link and click it programmatically
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'promptly-data.json';
        downloadLink.setAttribute('aria-hidden', 'true');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        if (process.env.NODE_ENV !== 'test') {
            document.body.removeChild(downloadLink);
        }
    }

    /**
     * Function to handle the full process of exporting prompts and tags data.
     */
    export function exportPromptsAndTagsData() {
        try {
            const url = prepareDataForExport();
            downloadData(url);
        } catch (error) {
            console.error('Something went wrong while exporting data:', error);
        }
    }
</script>

<button
    type="button"
    on:click={exportPromptsAndTagsData}
    title="Export prompts and tags data"
    aria-label="Export prompts and tags data"
>
    <Icon name="download" />
    <span>Export Data</span>
</button>
