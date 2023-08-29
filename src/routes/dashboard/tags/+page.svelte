<script lang="ts">
	import { tagSortOptions } from '$dashboardData/SortOptions';

	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
</script>

<svelte:head>
	<title>Tag Management</title>
	<meta name="description" content="Manage your tags with ease using our tag management system." />
</svelte:head>

<h1 class="text-xl text-center mb-7">Tag Management</h1>

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="tag" />
	<SortSelector itemType="tag" sortOptions={tagSortOptions} />
</nav>
