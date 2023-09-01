<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import type { PromptSchema } from '$databaseDir/schema';

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
	function handleFavoriteStatusToggle() {
		promptLocalStorageManager.updateItem(promptId, { isFavorited: !isFavorited });
	}
</script>

<ListItem
	title={`Edit prompt: ${title}`}
	onItemClickOrKeyPress={() => dispatch('editPrompt', prompt)}
>
	<h2 class="flex gap-2 font-normal leading-none select-none">
		<Icon name="lightbulb" size={15} extraStyles="self-start" />

		<span>
			{title}
		</span>
	</h2>

	<div class="flex items-center gap-1 text-muted-foreground">
		<FavoriteToggleBtn
			iconSize={20}
			{isFavorited}
			context="PromptItem"
			on:favoriteToggled={handleFavoriteStatusToggle}
		/>

		<CopyPromptTextBtn promptTextToCopy={text} toastNotificationTarget="dashboardLayout" />
	</div>
</ListItem>
