<script lang="ts">
	import type { PromptSchema } from '$databaseDir/schema';

	import { filteredPromptsStore, totalPromptCountStore } from '$dashboardStores/promptsStore';

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
			? $filteredPromptsStore.filter((prompt) => prompt.isFavorited)
			: $filteredPromptsStore;

		displayedPromptsCount = displayedPrompts.length;
	}

	$: {
		if ($totalPromptCountStore === 0) stateMessage = NO_PROMPTS_AVAILABLE_MESSAGE;
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
		itemLabel="prompt"
		totalItems={$totalPromptCountStore}
		displayedItems={displayedPromptsCount}
	/>

	<ListContainer itemType="prompt" bind:itemsListRef={promptListRef}>
		{#each displayedPrompts as prompt (prompt.id)}
			<PromptItem {prompt} on:editPrompt />
		{/each}
	</ListContainer>
{/if}

<ListControls
	itemType="prompt"
	itemsListRef={promptListRef}
	totalItems={$totalPromptCountStore}
	displayedItems={displayedPromptsCount}
	on:addItem
	on:deleteAllItems
/>
