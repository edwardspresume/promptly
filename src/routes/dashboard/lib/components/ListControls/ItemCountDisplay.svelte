<script lang="ts">
    import type { ItemType } from '$dashboardTypes';

    export let itemType: ItemType;
    export let totalItemCount: number;
    export let displayedItemCount: number;

    $: displayedItemName = totalItemCount === 1 ? itemType : `${itemType}s`;
</script>

<aside class="text-slate-500" aria-label="Display count of {displayedItemName}">
    Viewing {displayedItemCount} out of {totalItemCount}
    {displayedItemName}
</aside>
