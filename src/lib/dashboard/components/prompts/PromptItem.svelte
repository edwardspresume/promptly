<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import type { PromptSchema } from '$databaseDir/schema';

	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { notifyError } from '$dashboardUtils/toastUtils';

	import ListItem from '$dashboardComponents/list/ListItem.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import CopyPromptTextBtn from './CopyPromptTextBtn.svelte';
	import FavoriteToggleBtn from './FavoriteToggleBtn.svelte';

	export let prompt: PromptSchema;

	const dispatch = createEventDispatcher();

	let { id: promptId, title, text, isFavorited } = prompt;

	$: {
		({ id: promptId, title, text, isFavorited } = prompt);
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
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to toggle favorite. Please try again.';

				notifyError(errorMessage, {
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
	<h2 class="flex gap-2 font-normal leading-none select-none">
		<Icon name="lightbulb" size={15} class="self-start" />

		<span>
			{title}
		</span>
	</h2>

	<div class="flex items-center gap-1 text-muted-foreground">
		<FavoriteToggleBtn
			iconSize={20}
			{isFavorited}
			on:favoriteToggled={handleFavoriteStatusToggle}
			class="p-1 h-fit"
		/>

		<CopyPromptTextBtn
			promptTextToCopy={text}
			toastNotificationTarget="dashboardLayout"
			class="p-1 h-fit"
		/>
	</div>
</ListItem>
