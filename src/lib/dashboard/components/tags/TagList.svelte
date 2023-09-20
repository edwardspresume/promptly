<script lang="ts">
	import { filteredUserTagsStore, userTagsTotalCountStore } from '$dashboardStores/tagsStore';

	import ListContainer from '$dashboardComponents/list/ListContainer.svelte';
	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import TagItem from './TagItem.svelte';

	export let tagListRef: HTMLElement;

	const NO_TAGS_AVAILABLE_MESSAGE = 'No tags available. Please add one';
	const NO_MATCH_MESSAGE = 'There are no tags that match your search';

	let stateMessage: string;

	$: displayedTagsCount = $filteredUserTagsStore.length;

	$: {
		if ($userTagsTotalCountStore === 0) stateMessage = NO_TAGS_AVAILABLE_MESSAGE;
		else if (displayedTagsCount === 0) stateMessage = NO_MATCH_MESSAGE;
		else stateMessage = '';
	}
</script>

{#if stateMessage !== ''}
	<ListStateNotifier {stateMessage} />
{:else}
	<ListCounter
		itemType="userTag"
		totalItems={$userTagsTotalCountStore}
		displayedItems={displayedTagsCount}
	/>

	<ListContainer itemType="userTag" bind:itemsListRef={tagListRef}>
		{#each $filteredUserTagsStore as tag (tag.id)}
			<TagItem {tag} on:editTag on:deleteTag />
		{/each}
	</ListContainer>
{/if}
