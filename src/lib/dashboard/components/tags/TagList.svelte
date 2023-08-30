<script lang="ts">
	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import { filteredTagsStore, totalTagsCountStore } from '$dashboardStores/tagsStore';

	import TagItem from './TagItem.svelte';

	const NO_TAGS_AVAILABLE_MESSAGE = 'No tags available. Please add one';
	const NO_MATCH_MESSAGE = 'There are no tags that match your search';

	let stateMessage: string;

	$: displayedTagsCount = $filteredTagsStore.length;

	$: {
		if ($totalTagsCountStore === 0) stateMessage = NO_TAGS_AVAILABLE_MESSAGE;
		else if (displayedTagsCount === 0) stateMessage = NO_MATCH_MESSAGE;
		else stateMessage = '';
	}
</script>

{#if stateMessage !== ''}
	<ListStateNotifier {stateMessage} />
{:else}
	<ListCounter
		itemLabel="tag"
		totalItems={$totalTagsCountStore}
		displayedItems={displayedTagsCount}
	/>
	<section
		aria-label="List of tags"
		class="mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
	>
		{#each $filteredTagsStore as tag}
			<TagItem {tag} />
		{/each}
	</section>
{/if}
