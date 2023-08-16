<script lang="ts">
    import type { ItemType } from '$dashboardTypes/dashboardTypes';

    import AddItemBtn from '$dashboardComponents/ListControls/AddItemBtn.svelte';
    import DeleteAllItemsBtn from '$dashboardComponents/ListControls/DeleteAllItemsBtn.svelte';
    import ScrollToTopBtn from '$dashboardComponents/ListControls/ScrollToTopBtn.svelte';

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
