<script lang="ts">
	import type { ItemType, SortOption } from '$dashboardTypes';

	import { promptSortingPreference } from '$dashboardStores/promptsStore';
	import { tagSortingPreference } from '$dashboardStores/tagsStore';

	import * as Select from '$globalComponents/ui/select';

	export let itemType: ItemType;

	// The available sort options for the select element.
	export let sortOptions: SortOption[];

	// The currently selected sort option.
	export let selectedSortOption: string = '';

	function setSortingPreference() {
		if (itemType === 'tag') tagSortingPreference.set(selectedSortOption);

		if (itemType === 'prompt') promptSortingPreference.set(selectedSortOption);
	}
</script>

<Select.Root onValueChange={setSortingPreference} bind:value={selectedSortOption}>
	<Select.Trigger title="Sort options" aria-label="Sort options" class="sm:max-w-[11rem]">
		<Select.Value placeholder="Sort" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Sort by:</Select.Label>
			{#each sortOptions as { value, label }}
				<Select.Item {value} {label}>{label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
