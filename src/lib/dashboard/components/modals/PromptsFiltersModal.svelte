<script lang="ts">
	import type { SimplifiedTagSchema } from '$databaseDir/schema';

	import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';

	import { userPromptSortOptions } from '$dashboardData/SortOptions';

	import { isPromptFilterActive } from '$dashboardStores/promptModalFilterStore';
	import { userPromptSortOrder } from '$dashboardStores/userPromptsStore';
	import { userTagsTotalCountStore } from '$dashboardStores/userTagsStore';

	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import CloseModalBtn from './CloseModalBtn.svelte';

	export let promptsFiltersModalRef: HTMLDialogElement;
	export let sharedTags: SimplifiedTagSchema[] = [];

	let selectedTagIds: string[] = [];

	let selectedSortOption: string = '';

	/**
	 * Clears all the selected filters
	 * Resets the selected tag ids to empty array and sort option to empty string.
	 */
	function clearFilters() {
		selectedTagIds = [];

		selectedSortOption = '';
		userPromptSortOrder.set('');
	}

	$: {
		isPromptFilterActive.set(
			selectedTagIds.length > 0 ||
				(selectedSortOption.length > 0 && selectedSortOption !== 'default:default')
		);
	}

	$: tagSelectorLabel = sharedTags.length > 0 ? 'Community tag' : 'Tag';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={promptsFiltersModalRef}
	on:click={(event) => closeDialogOnOutsideClick(event, promptsFiltersModalRef)}
	class="w-3/4 h-full max-w-sm max-h-full m-0 ml-auto rounded-none backdrop:backdrop-blur-none"
>
	<header class="flex items-center justify-between pb-2 mb-8">
		<h3 class="text-lg">Filters</h3>
		<CloseModalBtn dialogElement={promptsFiltersModalRef} />
	</header>

	<div class="grid gap-5">
		<SortSelector
			itemType="userPrompt"
			sortOptions={userPromptSortOptions}
			bind:selectedSortOption
		/>

		{#if $userTagsTotalCountStore}
			<TagSelector
				{sharedTags}
				bind:selectedTagIds
				label={tagSelectorLabel}
				filterPromptBasedOnTags={true}
			/>
		{/if}

		<Button type="button" on:click={clearFilters}>Clear Filters</Button>
	</div>
</dialog>

<style>
	dialog {
		animation: slideInKeyframe 0.4s ease-in-out;
	}

	@keyframes slideInKeyframe {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
