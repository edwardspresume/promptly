<script lang="ts">
	import type { Variant } from '$globalComponents/ui/button';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { copyToClipboard } from '$dashboardUtils/functions';
	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;
	export { className as class };
	export let iconSize: number = 22;
	export let promptDescriptionToCopy: string;
	export let toastNotificationTarget: string;
	export let buttonVariant: Variant = 'ghost';

	/**
	 * Copies the prompt description to the clipboard and shows a notification.
	 * @async
	 * @returns {Promise<void>} No return value
	 */
	const handleCopy = async (event: Event) => {
		event.stopPropagation();

		await copyToClipboard(
			promptDescriptionToCopy,
			'Prompt description copied!',
			'Failed to copy prompt description',
			toastNotificationTarget
		);
	};
</script>

<Button
	size="icon"
	type="button"
	title="Copy Prompt"
	variant={buttonVariant}
	aria-label="Copy prompt to clipboard"
	on:click={handleCopy}
	class={cn('hover:text-blue-500 w-fit', className)}
>
	<Icon name="copy" size={iconSize} />
</Button>
