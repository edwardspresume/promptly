<script lang="ts">
	import type { ItemType, SortOption } from '$dashboardTypes';

	import { promptSortingPreference } from '$dashboardStores/promptsStore';
	import { tagSortingPreference } from '$dashboardStores/tagsStore';

	export let itemType: ItemType;

	// The available sort options for the select element.
	export let sortOptions: SortOption[];

	// The currently selected sort option.
	export let selectedSortOption: string = '';

	function setSortingPreference() {
		if (itemType === 'tag') tagSortingPreference.set(selectedSortOption);

		if (itemType === 'prompt') promptSortingPreference.set(selectedSortOption);
	}
</script>

<select
	title="Sort options"
	aria-label="Sort options"
	bind:value={selectedSortOption}
	on:change={setSortingPreference}
	class="px-3 py-2 text-sm bg-transparent border rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
>
	<option value="" disabled selected>Sort by</option>
	{#each sortOptions as { value, label, announceMessage }}
		<option {value} data-announce={announceMessage}>{label}</option>
	{/each}
</select>

<style lang="postcss">
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.1rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		appearance: none;
	}
</style>
