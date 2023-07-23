<script lang="ts">
    import { writable } from 'svelte/store';

    import { closeDialogOnOutsideClick } from '$utils/functions';

    import { promptSortOptions } from '$data/SortOptions';

    import promptsStore from '$stores/promptsStore';
    import tagsStore from '$stores/tagStore';

    import SortSelector from '$components/Filters/SortSelector.svelte';
    import TagSelector from '$components/Filters/TagSelector.svelte';
    import CloseModalBtn from './CloseModalBtn.svelte';

    export let promptsFiltersModalRef: HTMLDialogElement;

    const totalNumberOfTags = tagsStore.totalTagCount;
    let selectedTagIds = writable<number[]>([]);
    let selectedSortOption: string;

    /**
     * Clears all the selected filters
     * Resets the selected tag ids to empty array and sort option to empty string.
     */
    function clearFilters() {
        if ($selectedTagIds.length > 0) selectedTagIds.set([]);

        selectedSortOption = '';
        promptsStore.setSortingPreference('');
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:click={(event) =>
        closeDialogOnOutsideClick(event, promptsFiltersModalRef)}
    bind:this={promptsFiltersModalRef}
    class="relative w-3/4 h-full max-w-sm max-h-full m-0 ml-auto dark:text-white dark:bg-black/60 backdrop-blur-xl backdrop:bg-violet-700/20"
>
    <header class="flex justify-between pb-5 border-b border-white/10 mb-7">
        <h2 class="text-lg font-bold">Filters</h2>
        <CloseModalBtn dialogElement={promptsFiltersModalRef} />
    </header>

    <div class="grid gap-4">
        <SortSelector
            store={promptsStore}
            sortOptions={promptSortOptions}
            bind:selectedSortOption
        />

        {#if $totalNumberOfTags}
            <TagSelector {selectedTagIds} filterPromptBasedOnTags={true} />
        {/if}

        <button type="button" class="w-full theme" on:click={clearFilters}
            >Clear Filters</button
        >
    </div>
</dialog>
