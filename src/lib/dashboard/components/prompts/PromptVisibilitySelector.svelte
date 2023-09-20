<script lang="ts">
	import { page } from '$app/stores';

	import type { PromptSchema } from '$databaseDir/schema';
	import { RoutePaths } from '$globalTypes';

	import { copyToClipboard } from '$dashboardUtils/functions';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import Label from '$globalComponents/ui/label/label.svelte';

	export let promptId: PromptSchema['id'];
	export let promptVisibility: PromptSchema['visibility'];

	const visibilityOptions: PromptSchema['visibility'][] = ['Private', 'Private-Link', 'Public'];

	/**
	 * Copies the prompt link to the clipboard and shows a notification.
	 */
	function handleCopy(event: Event) {
		event.stopPropagation();

		const promptToShare = `${$page.url.origin}${RoutePaths.DASHBOARD_SHARED_PROMPT}/${promptId}`;

		copyToClipboard(promptToShare, 'Prompt link copied!', 'baseModal');
	}
</script>

<fieldset class="grid gap-1">
	<Label for="promptVisibilitySelector">Visibility</Label>

	<div class="flex gap-2">
		<select
			bind:value={promptVisibility}
			name="visibility"
			id="promptVisibilitySelector"
			class="flex-grow capitalize"
		>
			{#each visibilityOptions as option}
				<option value={option} selected={option === promptVisibility}>
					{option}
				</option>
			{/each}
		</select>

		{#if promptVisibility !== 'Private'}
			<Button
				size="icon"
				type="button"
				variant="outline"
				title="Copy prompt link to share with others"
				aria-label="Copy prompt link to share with others"
				on:click={handleCopy}
				class="hover:text-blue-500"
			>
				<Icon name="link" />
			</Button>
		{/if}
	</div>
</fieldset>
