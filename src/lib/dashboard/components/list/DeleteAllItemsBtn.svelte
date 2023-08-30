<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ItemType } from '$dashboardTypes';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let itemType: ItemType;

	const dispatch = createEventDispatcher();

	$: title = `Delete All ${itemType}s`;
</script>

<Button
	size="sm"
	type="button"
	aria-label={title}
	variant="destructive"
	on:click={() => dispatch('deleteAllItems')}
	class="flex gap-2 px-2 bg-destructive/10 text-muted-foreground hover:text-foreground"
>
	<Icon name="delete" size={20} />
	<span>
		{title}
	</span>
</Button>
