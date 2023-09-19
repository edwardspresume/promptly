<script lang="ts">
	import type { ItemType, SortOption } from '$dashboardTypes';

	import { userPromptSortOrder } from '$dashboardStores/promptsStore';
	import { tagSortingPreference } from '$dashboardStores/tagsStore';

	export let itemType: ItemType;

	// The available sort options for the select element.
	export let sortOptions: SortOption[];

	// The currently selected sort option.
	export let selectedSortOption: string = '';

	function setSortingOrder() {
		if (itemType === 'tag') tagSortingPreference.set(selectedSortOption);

		if (itemType === 'prompt') userPromptSortOrder.set(selectedSortOption);
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
