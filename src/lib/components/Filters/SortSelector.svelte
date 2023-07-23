<script lang="ts">
    import type { PromptStore, SortOption, TagStore } from '$types';

    // The store to which the selected sort option should be applied.
    export let store: PromptStore | TagStore;

    // The available sort options for the select element.
    export let sortOptions: SortOption[];

    // The currently selected sort option.
    export let selectedSortOption: string = '';
</script>

<select
    title="Sort options"
    aria-label="Sort options"
    bind:value={selectedSortOption}
    on:change={() => store.setSortingPreference(selectedSortOption)}
>
    <option value="" disabled selected>Sort by</option>
    {#each sortOptions as { value, label, announceMessage }}
        <option {value} data-announce={announceMessage}>{label}</option>
    {/each}
</select>

<style lang="postcss">
    select {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.1rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        appearance: none;
    }
</style>
