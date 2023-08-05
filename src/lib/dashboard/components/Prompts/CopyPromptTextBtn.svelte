<script lang="ts">
    import { notifySuccess } from '$dashboardUtils/toast';

    import Icon from '$globalComponents/Icon.svelte';

    export let promptText: string;
    export let iconSize: number = 22;
    export let toastTarget: string = '';

    /**
     * Copies the text to the clipboard and shows a success notification
     */
    const copyPromptTextToClipboard = async () => {
        try {
            if (!promptText) {
                console.error('No prompt text provided');
                return;
            }

            await navigator.clipboard.writeText(promptText);

            if (toastTarget) {
                notifySuccess('Prompt text copied!', {
                    target: toastTarget,
                });
            } else {
                notifySuccess('Prompt text copied!');
            }
        } catch (error) {
            console.error('Failed to prompt text: ', error);
        }
    };
</script>

<button
    type="button"
    title="Copy Prompt"
    aria-label="Copy prompt to clipboard"
    on:click|stopPropagation={copyPromptTextToClipboard}
    class="transition-colors duration-200 text-slate-800 hover:text-blue-500 dark:hover:text-blue-500 dark:text-slate-300"
>
    <Icon name="copy" size={iconSize} />
</button>
