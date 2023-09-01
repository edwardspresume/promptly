<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let iconSize: number = 22;
	export let buttonTitle: string = '';

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		event.stopPropagation();
		dispatch('click');
	}
</script>

<Button
	size="icon"
	type="button"
	variant="ghost"
	title={buttonTitle}
	aria-label={buttonTitle}
	on:click={handleClick}
	class="p-1 hover:text-red-500 h-fit w-fit"
>
	<Icon name="delete" size={iconSize} />
</Button>
