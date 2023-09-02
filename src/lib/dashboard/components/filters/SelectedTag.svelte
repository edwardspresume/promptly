<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { TagSchema } from '$databaseDir/schema';

	import Button from '$globalComponents/ui/button/button.svelte';

	export let tag: TagSchema;

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		event.stopPropagation();
		dispatch('removeTag');
	}
</script>

<Button
	size="sm"
	type="button"
	variant="ghost"
	title="Remove tag"
	aria-label={`Remove ${tag.name} tag`}
	on:click={handleClick}
	class="flex gap-2 p-1 text-xs select-none w-fit h-fit bg-foreground text-background"
>
	<span>{tag.name}</span>
	<span>&#x2715;</span>
</Button>
