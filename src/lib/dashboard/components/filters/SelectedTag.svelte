<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { SimplifiedTagSchema } from '$databaseDir/schema';

	import Button from '$globalComponents/ui/button/button.svelte';

	export let tag: SimplifiedTagSchema;
	export let isSharedTag: boolean = false;

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		event.stopPropagation();
		dispatch('removeTag');
	}
</script>

<Button
	type="button"
	variant="ghost"
	title="Remove tag"
	aria-label={`Remove ${tag.name} tag`}
	on:click={handleClick}
	class="flex gap-1 p-1 text-xs select-none w-fit h-fit bg-foreground text-background"
>
	<span>{tag.name}</span>
	<span>&#x2715;</span>

	{#if isSharedTag}
		<input type="checkbox" name="sharedTagNames" checked={true} value={tag.name} class="hidden" />
	{:else}
		<input type="checkbox" name="tagIds" checked={true} value={tag.id} class="hidden" />
	{/if}
</Button>
