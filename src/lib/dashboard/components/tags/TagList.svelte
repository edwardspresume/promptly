<script lang="ts">
	import { filteredTagsStore, totalTagsCountStore } from '$dashboardStores/tagsStore';

	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import TagItem from './TagItem.svelte';

	export let tagsListRef: HTMLElement;

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
		bind:this={tagsListRef}
		aria-label="List of tags"
		class="p-1 mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
	>
		{#each $filteredTagsStore as tag (tag.id)}
			<TagItem {tag} on:deleteTag />
		{/each}
	</section>
{/if}
