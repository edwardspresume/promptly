<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';

	import type { TagSchema } from '$databaseDir/schema';

	export let tag: TagSchema;
	// Represents the index of the tag in the list
	export let index: number;
	// Represents whether the tag is the currently active (highlighted) tag
	export let isActive: boolean;

	const dispatch = createEventDispatcher();

	let tagButton: HTMLElement;

	afterUpdate(() => {
		if (isActive && tagButton) {
			tagButton.scrollIntoView({
				behavior: 'instant',
				block: 'nearest'
			});
		}
	});
</script>

<button
	type="button"
	id={`tag-${index}`}
	bind:this={tagButton}
	class:active={isActive}
	on:focus={() => dispatch('focus')}
	on:mouseover={() => dispatch('hover')}
	on:click|stopPropagation={() => dispatch('addTag')}
	class="block w-full p-1 text-sm text-left transition-colors duration-300 rounded-md select-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
>
	{tag.name}
</button>

<style>
	/* Highlight color for the active tag */
	.active {
		@apply bg-accent text-accent-foreground;
	}
</style>
