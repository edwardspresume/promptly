<script>
	import { createEventDispatcher } from 'svelte';

	import { isPromptFilterActive } from '$dashboardStores/promptModalFilterStore';

	import Button from '$globalComponents/ui/button/button.svelte';

	const dispatch = createEventDispatcher();
</script>

<Button
	type="button"
	variant="outline"
	title="Show Filters"
	aria-label="Show Filters"
	on:click={() => dispatch('showFilters')}
	class={$isPromptFilterActive ? 'outline-primary outline outline-2 ' : ''}
>
	Filters
</Button>
