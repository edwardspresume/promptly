<script lang="ts">
	import type { ItemType } from '$dashboardTypes';

	export let itemType: ItemType;
	export let itemsListRef: HTMLElement;
</script>

<section
	aria-label="List of {itemType}s"
	bind:this={itemsListRef}
	class="p-1 mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
>
	<slot />
</section>
