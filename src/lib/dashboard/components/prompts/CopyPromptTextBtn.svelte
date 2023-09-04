<script lang="ts">
	import type { Variant } from '$globalComponents/ui/button';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';
	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;
	export { className as class };
	export let promptTextToCopy: string;
	export let iconSize: number = 22;
	export let toastNotificationTarget: string;
	export let buttonVariant: Variant = 'ghost';

	/**
	 * Copies the prompt text to the clipboard and shows a notification.
	 * @async
	 * @returns {Promise<void>} No return value
	 */
	const copyPromptTextToClipboard = async (event: Event) => {
		event.stopPropagation();

		try {
			if (!promptTextToCopy) {
				throw new Error('No prompt text provided');
			}

			await navigator.clipboard.writeText(promptTextToCopy);

			notifySuccess('Prompt text copied!', {
				target: toastNotificationTarget
			});
		} catch (error) {
			console.error('Failed to prompt text: ', error);

			notifyError('Failed to copy prompt text', {
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
	on:click={copyPromptTextToClipboard}
	class={cn('hover:text-blue-500 w-fit', className)}
>
	<Icon name="copy" size={iconSize} />
</Button>
