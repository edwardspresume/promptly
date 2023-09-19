<script lang="ts">
	import type { PageData } from './$types';

	import { communityPromptsStore } from '$dashboardStores/communityPromptsStore';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import CommunityPromptList from '$dashboardComponents/prompts/CommunityPromptList.svelte';

	export let data: PageData;

	communityPromptsStore.set(data.communityPrompts);
</script>

<svelte:head>
	<title>Community Prompts</title>
	<meta
		name="description"
		content="Community prompts are prompts that are made public by the community."
	/>
</svelte:head>

<h1 class="text-xl text-center mb-7">Community Prompts</h1>

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="communityPrompt" />
	<FilterDisplayButton />
</nav>

<CommunityPromptList />
