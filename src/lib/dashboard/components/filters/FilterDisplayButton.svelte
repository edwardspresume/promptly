<script>
	import { createEventDispatcher } from 'svelte';
    
	import Button from '$globalComponents/ui/button/button.svelte';

	const dispatch = createEventDispatcher();
</script>

<Button
	type="button"
	variant="outline"
	title="Show Filters"
	aria-label="Show Filters"
	on:click={() => dispatch('showFilters')}
>
	Filters
</Button>
