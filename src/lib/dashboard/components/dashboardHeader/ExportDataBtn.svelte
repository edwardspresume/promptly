<script context="module" lang="ts">
	import { get } from 'svelte/store';

	import { allPromptsStore } from '$dashboardStores/promptsStore';
	import { allTagsStore } from '$dashboardStores/tagsStore';
	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import Icon from '$globalComponents/Icon.svelte';

	/**
	 * Function to prepare data for export, creating a downloadable JSON file
	 * containing data from the userProfile, prompts and tags stores.
	 * @returns {string} downloadUrl - The URL of the downloadable JSON file
	 */
	export function prepareDataForExport() {
		// Retrieve prompts and tags data from the store
		const profile = get(userProfileStore);
		const prompts = get(allPromptsStore);
		const tags = get(allTagsStore);

		// Combine the data into a single object
		const exportData = {
			...(profile && { profile }),
			prompts,
			tags
		};

		// Create a Blob object from the JSON string
		const exportBlob = new Blob([JSON.stringify(exportData)], {
			type: 'application/json'
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
