<script lang="ts">
	import { totalPromptCountStore } from '$dashboardStores/promptsStore';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import ListControls from '$dashboardComponents/list/ListControls.svelte';
	import PromptList from '$dashboardComponents/prompts/PromptList.svelte';
	import TabGroup from '$dashboardComponents/prompts/TabGroup.svelte';

	let promptListRef: HTMLElement;
	let promptsFiltersModalRef: HTMLDialogElement;
	let displayedPromptsCount: number;

	let selectedTabIndex: number = 0;
</script>

<svelte:head>
	<title>Promptly</title>
	<meta name="description" content="Promptly Dashboard" />
</svelte:head>

<TabGroup on:tabItemClicked={({ detail }) => (selectedTabIndex = detail.selectedTabIndex)} />

<nav aria-label="Filter prompts" class="flex flex-col gap-3 my-5 sm:flex-row">
	<SearchBar searchTargetType="prompt" />
	<FilterDisplayButton on:showFilters={() => promptsFiltersModalRef.showModal()} />
</nav>

{#if selectedTabIndex === 0}
	<PromptList bind:promptListRef bind:displayedPromptsCount />
{:else if selectedTabIndex === 1}
	<PromptList bind:promptListRef bind:displayedPromptsCount isShowingOnlyFavorites={true} />
{/if}

<ListControls
	itemType="prompt"
	itemsListRef={promptListRef}
	totalItems={$totalPromptCountStore}
	displayedItems={displayedPromptsCount}
/>
