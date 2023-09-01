<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { PromptSchema } from '$databaseDir/schema';

	import ListItem from '$dashboardComponents/list/ListItem.svelte';
	import Icon from '$globalComponents/Icon.svelte';

	export let prompt: PromptSchema;

	const dispatch = createEventDispatcher();

	let { id: promptId, title, text, isFavorited } = prompt;

	$: {
		({ id: promptId, title, text, isFavorited } = prompt);
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
</ListItem>
