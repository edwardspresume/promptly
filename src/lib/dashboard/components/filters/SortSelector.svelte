<script lang="ts">
	import type { ItemType, SortOption } from '$dashboardTypes';

	import { userTagSortingPreference } from '$dashboardStores/tagsStore';
	import { userPromptSortOrder } from '$dashboardStores/userPromptsStore';

	export let itemType: ItemType;

	// The available sort options for the select element.
	export let sortOptions: SortOption[];

	// The currently selected sort option.
	export let selectedSortOption: string = '';

	function setSortingOrder() {
		if (itemType === 'userTag') userTagSortingPreference.set(selectedSortOption);

		if (itemType === 'userPrompt') userPromptSortOrder.set(selectedSortOption);
	}
</script>

<select
	title="Sort options"
	aria-label="Sort options"
	bind:value={selectedSortOption}
	on:change={setSortingOrder}
>
	<option value="" disabled selected>Sort by</option>
	{#each sortOptions as { value, label, announceMessage }}
		<option {value} data-announce={announceMessage}>{label}</option>
	{/each}
</select>
