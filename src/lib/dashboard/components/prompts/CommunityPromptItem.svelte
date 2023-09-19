<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ShareablePromptSchema } from '$databaseDir/schema';

	import ListItem from '$dashboardComponents/list/ListItem.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import CopyPromptDescriptionBtn from './CopyPromptDescriptionBtn.svelte';

	export let prompt: ShareablePromptSchema;

	const dispatch = createEventDispatcher();

	let { title, description } = prompt;
</script>

<ListItem
	title={`View prompt: ${title}`}
	onItemClickOrKeyPress={() => dispatch('viewPrompt', prompt)}
>
	<h2 class="flex gap-2 font-normal leading-none select-none">
		<Icon name="lightbulb" size={15} class="self-start" />

		<span>
			{title}
		</span>
	</h2>

	<div class="flex items-center gap-1 text-muted-foreground">
		<CopyPromptDescriptionBtn
			promptDescriptionToCopy={description}
			toastNotificationTarget="dashboardLayout"
			class="p-1 h-fit"
		/>
	</div>
</ListItem>
