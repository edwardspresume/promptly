<script lang="ts">
    import type { ItemType } from '$types';

    import promptsStore from '$stores/promptsStore';
    import tagsStore from '$stores/tagStore';

    export let searchTargetType: ItemType;

    let labelText: string = '';

    // searchQuery will hold the value of the search input
    let searchQuery: string = '';

    /**
     * Updates the labelText and the textFilter in the store
     * based on the searchTargetType and searchQuery.
     */
    $: {
        if (searchTargetType === 'tag') {
            labelText = `Search tags by name`;
            tagsStore.setTextFilter(searchQuery);
        }

        if (searchTargetType === 'prompt') {
            labelText = `Search prompts by title`;
            promptsStore.setTextFilter(searchQuery);
        }
    }
</script>

<label class="flex-grow">
    <span class="sr-only">{labelText}</span>
    <input
        type="search"
        title={labelText}
        enterkeyhint="search"
        aria-label={labelText}
        placeholder={labelText}
        bind:value={searchQuery}
    />
</label>

<style lang="postcss">
    input[type='search']::-webkit-search-cancel-button {
        cursor: pointer;
        block-size: 1.5rem;
        inline-size: 1.5rem;
        -webkit-appearance: none;
        background-color: var(--text-color);
        -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
    }
</style>
