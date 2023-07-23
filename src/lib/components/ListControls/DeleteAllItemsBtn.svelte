<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { ItemType } from '$types';

    export let itemType: ItemType;

    const dispatch = createEventDispatcher();

    $: title = `Delete All ${itemType}s`;
</script>

<button
    {title}
    type="button"
    aria-label={title}
    on:click={() => dispatch('deleteAllItems')}
    class="p-1 px-2 transition duration-200 rounded-md bg-blue-600/20 hover:bg-blue-600"
    >{title}</button
>
