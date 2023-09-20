<script lang="ts">
	import {
		communityPromptTotalCount,
		filteredCommunityPromptsStore
	} from '$dashboardStores/communityPromptsStore';

	import ListContainer from '$dashboardComponents/list/ListContainer.svelte';
	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import ScrollToTopBtn from '$dashboardComponents/list/ScrollToTopBtn.svelte';
	import CommunityPromptItem from './CommunityPromptItem.svelte';

	const NO_PROMPTS_AVAILABLE_MESSAGE =
		'No community prompts to display. Check back later for new entries!';
	const NO_MATCH_MESSAGE = "Couldn't find any matching prompts. Try adjusting your filters.";

	let stateMessage: string;
	let displayedPromptsCount: number;
	let communityPromptsListRef: HTMLElement;

	$: displayedPromptsCount = $filteredCommunityPromptsStore.length;

	$: {
		if ($communityPromptTotalCount === 0) stateMessage = NO_PROMPTS_AVAILABLE_MESSAGE;
		else if (displayedPromptsCount === 0) stateMessage = NO_MATCH_MESSAGE;
		else stateMessage = '';
	}
</script>

{#if stateMessage !== ''}
	<ListStateNotifier {stateMessage} />
{:else}
	<ListCounter
		itemType="communityPrompt"
		totalItems={$communityPromptTotalCount}
		displayedItems={displayedPromptsCount}
	/>

	<ListContainer itemType="communityPrompt" bind:itemsListRef={communityPromptsListRef}>
		{#each $filteredCommunityPromptsStore as prompt (prompt)}
			<CommunityPromptItem {prompt} on:viewPrompt />
		{/each}
	</ListContainer>
{/if}

<footer class="flex justify-end mt-4">
	<ScrollToTopBtn itemType="communityPrompt" bind:itemsListRef={communityPromptsListRef} />
</footer>
