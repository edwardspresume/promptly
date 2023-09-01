<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let iconSize: number;
	export let isFavorited: boolean = false;

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
	variant="ghost"
	title={buttonLabel}
	aria-label={buttonLabel}
	aria-checked={isFavorited}
	on:click={handleFavoriteToggleClick}
	class="p-1 hover:text-red-400 h-fit w-fit"
>
	<label>
		<span class="sr-only">{buttonLabel}</span>
		<input type="checkbox" checked={isFavorited} name="isFavorited" class="hidden" />
	</label>
	<Icon size={iconSize} {fill} name="favorite" />
</Button>
