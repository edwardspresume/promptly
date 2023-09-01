<script lang="ts">
	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import PromptList from '$dashboardComponents/prompts/PromptList.svelte';
	import TabGroup from '$dashboardComponents/prompts/TabGroup.svelte';

	let promptsFiltersModalRef: HTMLDialogElement;

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
	<PromptList />
{:else if selectedTabIndex === 1}
	<PromptList isShowingOnlyFavorites={true} />
{/if}
