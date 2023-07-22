<script>
    import { tagSortOptions } from '$data/SortOptions';
    import tagsStore from '$stores/tagStore';

    import SearchBar from '$components/Filter/SearchBar.svelte';
    import SortSelector from '$components/Filter/SortSelector.svelte';
    import TagList from '$components/Tags/TagList.svelte';
</script>

<svelte:head>
    <title>Tag Management</title>
    <meta
        name="description"
        content="Manage your tags with ease using our tag management system."
    />
</svelte:head>

<h1 class="text-xl text-center mb-7">Tag Management</h1>

<nav class="flex flex-col gap-3 mb-8 sm:flex-row">
    <SearchBar searchTargetType="tag" />
    <SortSelector store={tagsStore} sortOptions={tagSortOptions} />
</nav>

<TagList />
