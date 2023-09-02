<script lang="ts">
	import type { ItemType } from '$dashboardTypes';

	import AddItemBtn from './AddItemBtn.svelte';
	import DeleteAllItemsBtn from './DeleteAllItemsBtn.svelte';
	import ScrollToTopBtn from './ScrollToTopBtn.svelte';

	export let itemType: ItemType;
	export let totalItems: number;
	export let displayedItems: number;
	export let itemsListRef: HTMLElement;
</script>

<footer class="flex items-center justify-between gap-2 py-1 mt-4">
	{#if totalItems !== 0 && displayedItems > 1}
		<DeleteAllItemsBtn {itemType} on:deleteAllItems />
	{/if}

	<div class="flex ml-auto gap-7">
		<ScrollToTopBtn {itemType} {itemsListRef} />
		<AddItemBtn {itemType} on:addItem />
	</div>
</footer>
