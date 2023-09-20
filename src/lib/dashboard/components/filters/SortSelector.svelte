<script lang="ts">
	import type { ItemType, SortOption } from '$dashboardTypes';

	import { communityPromptSortOrder } from '$dashboardStores/communityPromptsStore';
	import { userPromptSortOrder } from '$dashboardStores/userPromptsStore';
	import { userTagSortingPreference } from '$dashboardStores/userTagsStore';

	import Label from '$globalComponents/ui/label/label.svelte';

	export let itemType: ItemType;

	// The available sort options for the select element.
	export let sortOptions: SortOption[];

	// The currently selected sort option.
	export let selectedSortOption: string = '';

	export let isLabelScreenReaderOnly: boolean = false;

	function setSortingOrder() {
		if (itemType === 'userTag') userTagSortingPreference.set(selectedSortOption);

		if (itemType === 'userPrompt') userPromptSortOrder.set(selectedSortOption);

		if (itemType === 'communityPrompt') communityPromptSortOrder.set(selectedSortOption);
	}
</script>

<Label class="grid gap-1">
	<span class={isLabelScreenReaderOnly ? 'sr-only' : ''}>Sort</span>

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
</Label>
