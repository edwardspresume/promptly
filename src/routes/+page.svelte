<script lang="ts">
    import type { PageData } from './$types';

    import FilterDisplayButton from '$components/Filters/FilterDisplayButton.svelte';
    import SearchBar from '$components/Filters/SearchBar.svelte';
    import TabGroup from '$components/Prompts/TabGroup.svelte';

    export let data: PageData;

    // Element references
    let promptsFiltersModalRef: HTMLDialogElement;

    let selectedTabIndex: number = 0;
</script>

<svelte:head>
    <title>Promptly</title>
    <meta name="description" content="Promptly Dashboard" />
</svelte:head>

<TabGroup
    on:tabItemClicked={({ detail }) =>
        (selectedTabIndex = detail.activeTabIndex)}
/>

<nav
    aria-label="Filter prompts"
    class="flex flex-col gap-3 mt-6 mb-5 overflow-hidden sm:flex-row"
>
    <SearchBar searchTargetType="prompt" />

    <FilterDisplayButton
        on:showFilters={() => promptsFiltersModalRef.showModal()}
    />
</nav>
