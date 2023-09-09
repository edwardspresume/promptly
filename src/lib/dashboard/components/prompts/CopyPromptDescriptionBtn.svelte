<script lang="ts">
	import type { Variant } from '$globalComponents/ui/button';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';
	import { cn, logError } from '$globalUtils';

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
	const copyPromptDescriptionToClipboard = async (event: Event) => {
		event.stopPropagation();

		try {
			if (!promptDescriptionToCopy) {
				throw new Error('No prompt description provided');
			}

			await navigator.clipboard.writeText(promptDescriptionToCopy);

			notifySuccess('Prompt description copied!', {
				target: toastNotificationTarget
			});
		} catch (error) {
			logError(error, 'Failed to copy prompt description');

			notifyError('Failed to copy prompt description', {
				target: toastNotificationTarget
			});
		}
	};
</script>

<Button
	size="icon"
	type="button"
	title="Copy Prompt"
	variant={buttonVariant}
	aria-label="Copy prompt to clipboard"
	on:click={copyPromptDescriptionToClipboard}
	class={cn('hover:text-blue-500 w-fit', className)}
>
	<Icon name="copy" size={iconSize} />
</Button>
