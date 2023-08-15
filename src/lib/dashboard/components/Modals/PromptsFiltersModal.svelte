<script lang="ts">
    import { writable } from 'svelte/store';

    import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';

    import { promptSortOptions } from '$dashboardData/SortOptions';

    import { promptSortingPreference } from '$dashboardStores/promptsStore';
    import { totalTagsCountStore } from '$dashboardStores/tagStore';

    import SortSelector from '$dashboardComponents/Filters/SortSelector.svelte';
    import TagSelector from '$dashboardComponents/Filters/TagSelector.svelte';
    import CloseModalBtn from './CloseModalBtn.svelte';

    export let promptsFiltersModalRef: HTMLDialogElement;

    let selectedTagIds = writable<string[]>([]);
    let selectedSortOption: string;

    /**
     * Clears all the selected filters
     * Resets the selected tag ids to empty array and sort option to empty string.
     */
    function clearFilters() {
        if ($selectedTagIds.length > 0) selectedTagIds.set([]);

        selectedSortOption = '';
        promptSortingPreference.set('');
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:click={(event) =>
        closeDialogOnOutsideClick(event, promptsFiltersModalRef)}
    bind:this={promptsFiltersModalRef}
    class="w-3/4 h-full max-w-sm max-h-full m-0 ml-auto bg-secondary text-primary backdrop-blur-xl backdrop:bg-violet-700/10"
>
    <header class="flex justify-between pb-5 border-b border-white/10 mb-7">
        <h2 class="text-lg font-bold">Filters</h2>
        <CloseModalBtn dialogElement={promptsFiltersModalRef} />
    </header>

    <div class="grid gap-4">
        <SortSelector
            itemType="prompt"
            sortOptions={promptSortOptions}
            bind:selectedSortOption
        />

        {#if $totalTagsCountStore}
            <TagSelector {selectedTagIds} filterPromptBasedOnTags={true} />
        {/if}

        <button type="button" class="w-full theme" on:click={clearFilters}
            >Clear Filters</button
        >
    </div>
</dialog>
