<script lang="ts">
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
	import { promptSortOptions } from '$dashboardData/SortOptions';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-xl text-center mb-7">Community Prompts</h1>


<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="prompt" />
	<SortSelector itemType="prompt" sortOptions={promptSortOptions} />
</nav>
