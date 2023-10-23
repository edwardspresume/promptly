<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ActivePromptTabLabel } from '$dashboardTypes';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	const dispatch = createEventDispatcher();

	interface Tab {
		label: ActivePromptTabLabel;
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

	let activePromptTab: ActivePromptTabLabel = 'All Prompts';

	/**
	 * This function will set the active tab and dispatch the custom event.
	 * @param tab - The tab to be activated
	 */
	function handleTabSelection(tab: ActivePromptTabLabel) {
		activePromptTab = tab;
		dispatch('tabItemClicked', { activePromptTab });
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
<nav role="tablist" aria-label="Tab Group" class="flex justify-center p-1">
	{#each tabs as { label, iconName } (label)}
		<Button
			role="tab"
			variant="ghost"
			type="button"
			on:click={() => handleTabSelection(label)}
			aria-controls={`tabpanel-${label}`}
			aria-selected={activePromptTab === label}
			tabindex={activePromptTab === label ? 0 : -1}
			class="flex w-full gap-2 border-b rounded-sm rounded-b-none text-lg {activePromptTab === label
				? 'border-primary border-b-2'
				: 'text-muted-foreground'}"
		>
			<Icon name={iconName} size={18} />
			{label}
		</Button>
	{/each}
</nav>
