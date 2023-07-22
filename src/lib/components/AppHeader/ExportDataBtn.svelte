<script>
    import { get } from 'svelte/store';

    import promptsStore from '$stores/promptsStore';
    import tagsStore from '$stores/tagStore';

    import Icon from '$components/General/Icon.svelte';

    /**
     * Function to handle data exportation, creating a downloadable JSON file
     * containing data from the 'prompts' and 'tags' stores.
     */
    function exportPromptsAndTagsData() {
        try {
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

            // Create a temporary downloadable link and click it programmatically
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = 'promptly-data.json';
            downloadLink.setAttribute('aria-hidden', 'true');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
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
