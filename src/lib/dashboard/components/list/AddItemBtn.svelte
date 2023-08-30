<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ItemType } from '$dashboardTypes';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let itemType: ItemType;

	const dispatch = createEventDispatcher();

	$: title = `Add ${itemType}`;
</script>

<Button
	{title}
	size="icon"
	type="button"
	aria-label={title}
	on:click={() => dispatch('addItem')}
	class="transition-all duration-500 ease-in-out rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:scale-105"
>
	<Icon name="add" size={26} />
</Button>
