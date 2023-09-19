<script lang="ts">
	import type { ItemType } from '$dashboardTypes';

	export let itemType: ItemType;
	export let itemsListRef: HTMLElement;

	let itemLabel: string = '';

	if (itemType === 'userPrompt') itemLabel = 'prompt';

	if (itemType === 'userTag') itemLabel = 'tag';

	if (itemType === 'communityPrompt') itemLabel = 'community prompt';
</script>

<section
	aria-label="List of {itemLabel}s"
	bind:this={itemsListRef}
	class="p-1 mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
>
	<slot />
</section>
