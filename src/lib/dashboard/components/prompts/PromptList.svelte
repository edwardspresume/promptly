<script lang="ts">
	import ListContainer from '$dashboardComponents/list/ListContainer.svelte';
	import ListCounter from '$dashboardComponents/list/ListCounter.svelte';
	import ListStateNotifier from '$dashboardComponents/list/ListStateNotifier.svelte';
	import { filteredPromptsStore, totalPromptCountStore } from '$dashboardStores/promptsStore';
	import type { PromptSchema } from '$databaseDir/schema';
	import PromptItem from './PromptItem.svelte';

	export let isShowingOnlyFavorites: boolean = false;

	const NO_PROMPTS_AVAILABLE_MESSAGE = 'No prompts available. Please add one';
	const NO_MATCH_MESSAGE = 'No prompts match your filter criteria';
	const NO_FAVORITE_PROMPTS_MESSAGE = 'Your favorites list is currently empty';

	let promptListRef: HTMLElement;

	let stateMessage: string;
	let displayedPrompts: PromptSchema[];
	let displayedPromptsCount: number;

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
			<PromptItem {prompt} />
		{/each}
	</ListContainer>
{/if}
