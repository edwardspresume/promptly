<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { Variant } from '$globalComponents/ui/button';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;

	export { className as class };
	export let iconSize: number = 22;
	export let buttonTitle: string = '';
	export let buttonVariant: Variant = 'ghost';

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		event.stopPropagation();
		dispatch('click');
	}
</script>

<Button
	size="icon"
	type="button"
	title={buttonTitle}
	variant={buttonVariant}
	aria-label={buttonTitle}
	on:click={handleClick}
	class={cn('hover:text-red-500 w-fit', className)}
>
	<Icon name="delete" size={iconSize} />
</Button>
