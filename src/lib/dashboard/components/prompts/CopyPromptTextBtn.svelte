<script lang="ts">
	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let promptTextToCopy: string;
	export let iconSize: number = 22;
	export let toastNotificationTarget: string;

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
	variant="ghost"
	title="Copy Prompt"
	aria-label="Copy prompt to clipboard"
	on:click={copyPromptTextToClipboard}
	class="p-1 hover:text-blue-500 h-fit w-fit"
>
	<Icon name="copy" size={iconSize} />
</Button>
