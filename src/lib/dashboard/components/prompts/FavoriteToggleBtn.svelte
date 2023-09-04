<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { Variant } from '$globalComponents/ui/button';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;

	export let iconSize: number;
	export { className as class };
	export let isFavorited: boolean = false;
	export let buttonVariant: Variant = 'ghost';

	const dispatch = createEventDispatcher();

	/**
	 * Toggles the favorite status of the prompt
	 */
	function handleFavoriteToggleClick(event: Event) {
		event.stopPropagation();
		dispatch('favoriteToggled');
	}

	$: fill = isFavorited ? '#E2264D' : 'currentColor';
	$: buttonLabel = isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
</script>

<Button
	role="switch"
	type="button"
	title={buttonLabel}
	variant={buttonVariant}
	aria-label={buttonLabel}
	aria-checked={isFavorited}
	on:click={handleFavoriteToggleClick}
	class={cn('hover:text-red-400', className)}
>
	<label>
		<span class="sr-only">{buttonLabel}</span>
		<input type="checkbox" checked={isFavorited} name="isFavorited" class="hidden" />
	</label>
	<Icon size={iconSize} {fill} name="favorite" />
</Button>
