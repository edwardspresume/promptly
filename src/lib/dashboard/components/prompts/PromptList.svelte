<script lang="ts">
	import type { PromptSchema } from '$databaseDir/schema';

	import { filteredUserPromptsStore, userPromptTotalCount } from '$dashboardStores/promptsStore';

	import ListContainer from '$dashboardComponents/list/ListContainer.svelte';
	import ListControls from '$dashboardComponents/list/ListControls.svelte';
	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import PromptItem from './PromptItem.svelte';

	export let isShowingOnlyFavorites: boolean = false;

	const NO_PROMPTS_AVAILABLE_MESSAGE = 'No prompts available. Please add one';
	const NO_MATCH_MESSAGE = 'No prompts match your filter criteria';
	const NO_FAVORITE_PROMPTS_MESSAGE = 'Your favorites list is currently empty';

	let stateMessage: string;
	let promptListRef: HTMLElement;
	let displayedPromptsCount: number;
	let displayedPrompts: PromptSchema[];

	$: {
		displayedPrompts = isShowingOnlyFavorites
			? $filteredUserPromptsStore.filter((prompt) => prompt.isFavorited)
			: $filteredUserPromptsStore;

		displayedPromptsCount = displayedPrompts.length;
	}

	$: {
		if ($userPromptTotalCount === 0) stateMessage = NO_PROMPTS_AVAILABLE_MESSAGE;
		else if (isShowingOnlyFavorites && displayedPromptsCount === 0)
			stateMessage = NO_FAVORITE_PROMPTS_MESSAGE;
		else if (displayedPromptsCount === 0) stateMessage = NO_MATCH_MESSAGE;
		else stateMessage = '';
	}
</script>

{#if stateMessage !== ''}
	<ListStateNotifier {stateMessage} />
{:else}
	<ListCounter
		itemType="userPrompt"
		totalItems={$userPromptTotalCount}
		displayedItems={displayedPromptsCount}
	/>

	<ListContainer itemType="userPrompt" bind:itemsListRef={promptListRef}>
		{#each displayedPrompts as prompt (prompt.id)}
			<PromptItem {prompt} on:editPrompt />
		{/each}
	</ListContainer>
{/if}

<ListControls
	itemType="userPrompt"
	itemsListRef={promptListRef}
	totalItems={$userPromptTotalCount}
	displayedItems={displayedPromptsCount}
	on:addItem
	on:deleteAllItems
/>
