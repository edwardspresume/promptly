<script lang="ts">
    import { afterUpdate, createEventDispatcher } from 'svelte';

    import type { TagSchema } from '$databaseDir/schema';

    export let tag: TagSchema;
    // Represents the index of the tag in the list
    export let index: number;
    // Represents whether the tag is the currently active (highlighted) tag
    export let isActive: boolean;

    const dispatch = createEventDispatcher();

    let tagButton: HTMLElement;

    afterUpdate(() => {
        if (isActive && tagButton) {
            tagButton.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
            });
        }
    });
</script>

<button
    type="button"
    bind:this={tagButton}
    id={`tag-${index}`}
    class:active={isActive}
    class="block w-full text-left p-1 px-2 rounded-md select-none"
    on:click|stopPropagation={() => dispatch('addTag')}
    on:focus={() => dispatch('focus')}
    on:mouseover={() => dispatch('hover')}
>
    {tag.name}
</button>

<style>
    /* Highlight color for the active tag */
    .active {
        background-color: #ccc;
    }
</style>
