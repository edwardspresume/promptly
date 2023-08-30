<script lang="ts">
	import type { ItemType } from '$dashboardTypes';

	export let itemLabel: ItemType;
	export let totalItems: number;
	export let displayedItems: number;

	$: displayedItemName = totalItems === 1 ? itemLabel : `${itemLabel}s`;
</script>

<section>
	<h4 aria-label="Display count of {displayedItemName}" class="text-sm text-muted-foreground">
		Viewing {displayedItems} out of {totalItems}
		{displayedItemName}
	</h4>
</section>
