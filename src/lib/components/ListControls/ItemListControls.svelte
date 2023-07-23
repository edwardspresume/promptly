<script lang="ts">
    import type { ItemType } from '$types';

    import AddItemBtn from '$components/ListControls/AddItemBtn.svelte';
    import DeleteAllItemsBtn from '$components/ListControls/DeleteAllItemsBtn.svelte';
    import ScrollToTopBtn from '$components/ListControls/ScrollToTopBtn.svelte';

    export let itemType: ItemType;
    export let totalItemCount: number;
    export let itemContainerRef: HTMLElement;
</script>

<footer class="flex items-center justify-between gap-2 py-1 mt-4 text-white">
    {#if totalItemCount !== 0}
        <DeleteAllItemsBtn {itemType} on:deleteAllItems />
    {/if}

    <div class="flex ml-auto gap-7">
        <ScrollToTopBtn {itemType} {itemContainerRef} />
        <AddItemBtn {itemType} on:addItem />
    </div>
</footer>
