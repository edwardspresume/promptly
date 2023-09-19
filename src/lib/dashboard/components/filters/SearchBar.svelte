<script lang="ts">
	import type { ItemType } from '$dashboardTypes';

	import { communityPromptTextFilter } from '$dashboardStores/communityPromptsStore';
	import { userPromptTextFilter } from '$dashboardStores/promptsStore';
	import { tagTextFilter } from '$dashboardStores/tagsStore';

	import Label from '$globalComponents/ui/label/label.svelte';

	export let searchTargetType: ItemType;

	let labelText: string = '';

	// searchQuery will hold the value of the search input
	let searchQuery: string = '';

	/**
	 * Updates the labelText and the textFilter in the store
	 * based on the searchTargetType and searchQuery.
	 */
	$: {
		if (searchTargetType === 'userTag') {
			labelText = `Search tags by name`;
			tagTextFilter.set(searchQuery);
		}

		if (searchTargetType === 'userPrompt') {
			labelText = `Search prompts by title`;
			userPromptTextFilter.set(searchQuery);
		}

		if (searchTargetType === 'communityPrompt') {
			labelText = `Search community prompts by title`;
			communityPromptTextFilter.set(searchQuery);
		}
	}
</script>

<Label class="flex-grow">
	<span class="sr-only">{labelText}</span>

	<input
		type="search"
		title={labelText}
		enterkeyhint="search"
		aria-label={labelText}
		placeholder={labelText}
		bind:value={searchQuery}
		class="searchFilterInput"
	/>
</Label>

<style lang="postcss">
	:global(.searchFilterInput)::-webkit-search-cancel-button {
		@apply cursor-pointer  bg-foreground;
		block-size: 1.5rem;
		inline-size: 1.5rem;
		-webkit-appearance: none;
		-webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
	}
</style>
