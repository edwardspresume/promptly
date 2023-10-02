<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import type { PromptSchema } from '$databaseDir/schema';

	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { notifyError } from '$dashboardUtils/toastUtils';

	import ListItem from '$dashboardComponents/list/ListItem.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import CopyPromptDescriptionBtn from './CopyPromptDescriptionBtn.svelte';
	import FavoriteToggleBtn from './FavoriteToggleBtn.svelte';

	export let prompt: PromptSchema;

	const dispatch = createEventDispatcher();

	let { id: promptId, title, description, isFavorited } = prompt;

	$: {
		({ id: promptId, title, description, isFavorited } = prompt);
	}

	/**
	 *  Toggles the favorite status of the prompt
	 */
	async function handleFavoriteStatusToggle() {
		if ($page.data.session !== null) {
			try {
				// Prepare form data
				const formData = new FormData();
				formData.append('isFavorited', String(!isFavorited));
				formData.append('promptId', String(promptId));

				// Send an asynchronous request to the server
				const response = await fetch('?/toggleFavorite', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					throw new Error('Failed to toggle favorite. Please try again.');
				}

				invalidateAll();
			} catch (error) {
				notifyError('Failed to toggle favorite. Please try again', {
					target: 'dashboardLayout'
				});
			}
		} else {
			promptLocalStorageManager.updateItem(promptId, { isFavorited: !isFavorited });
		}
	}
</script>

<ListItem
	title={`Edit prompt: ${title}`}
	onItemClickOrKeyPress={() => dispatch('editPrompt', prompt)}
>
	<h3 class="flex gap-2 font-normal leading-none select-none">
		<Icon name="lightbulb" size={15} class="self-start" />

		<span>
			{title}
		</span>
	</h3>

	<div class="flex items-center gap-1 text-muted-foreground">
		<FavoriteToggleBtn
			iconSize={20}
			{isFavorited}
			on:favoriteToggled={handleFavoriteStatusToggle}
			class="p-1 h-fit"
		/>

		<CopyPromptDescriptionBtn
			promptDescriptionToCopy={description}
			toastNotificationTarget="dashboardLayout"
			class="p-1 h-fit"
		/>
	</div>
</ListItem>
