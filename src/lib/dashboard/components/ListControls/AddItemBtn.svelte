<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { ItemType } from '$dashboardTypes/dashboardTypes';

    import Icon from '$globalComponents/Icon.svelte';

    export let itemType: ItemType;

    const dispatch = createEventDispatcher();

    $: title = `Add ${itemType}`;
</script>

<button
    {title}
    type="button"
    aria-label={title}
    class="p-2 font-bold duration-500 ease-in-out rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:scale-105"
    on:click={() => dispatch('addItem')}
>
    <Icon name="add" size={26} />
</button>
