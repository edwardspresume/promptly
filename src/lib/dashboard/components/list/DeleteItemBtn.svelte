<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let iconSize: number = 22;
	export let buttonTitle: string = '';

	const dispatch = createEventDispatcher();
</script>

<!-- <button
	type="button"
	title={buttonTitle}
	aria-label={buttonTitle}
	on:click|stopPropagation={() => dispatch('click')}
	class="transition-colors duration-200 text-slate-800 hover:text-red-500 dark:hover:text-red-500 dark:text-slate-300"
>
	<Icon name="delete" size={iconSize} />
</button> -->

<Button
	size="icon"
	type="button"
	variant="ghost"
	title={buttonTitle}
	aria-label={buttonTitle}
	on:click={() => dispatch('click')}
	class="hover:text-red-500 h-fit w-fit"
>
	<Icon name="delete" size={iconSize} />
</Button>
