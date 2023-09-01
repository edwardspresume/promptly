<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	const dispatch = createEventDispatcher();

	interface Tab {
		label: string;
		iconName: string;
	}

	let tabs: Tab[] = [
		{
			label: 'All Prompts',
			iconName: 'lightbulb'
		},

		{
			label: 'Favorites',
			iconName: 'favorite'
		}
	];

	let selectedTabIndex: number = 0;

	/**
	 * this function will set the active tab index and dispatch the custom event.
	 * @param {number} index - The index of the tab
	 */
	function handleTabSelection(index: number) {
		selectedTabIndex = index;

		dispatch('tabItemClicked', { selectedTabIndex });
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
<nav role="tablist" aria-label="Tab Group" class="flex justify-center p-1">
	{#each tabs as { label, iconName }, index}
		<Button
			role="tab"
			variant="ghost"
			type="button"
			on:click={() => handleTabSelection(index)}
			aria-controls={`tabpanel-${index}`}
			aria-selected={selectedTabIndex === index}
			tabindex={selectedTabIndex === index ? 0 : -1}
			class="flex w-full gap-2 border-b rounded-sm rounded-b-none text-lg {selectedTabIndex ===
			index
				? 'border-foreground border-b-2'
				: 'text-muted-foreground'}"
		>
			<Icon name={iconName} size={18} />
			{label}
		</Button>
	{/each}
</nav>
