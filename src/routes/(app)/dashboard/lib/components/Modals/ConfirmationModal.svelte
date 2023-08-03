<script lang="ts">
    import type { ConfirmationInfo } from '$dashboardTypes';
    import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';
    import { notifySuccess } from '$dashboardUtils/toast';

    import Icon from '$globalComponents/Icon.svelte';

    export let confirmationModalRef: HTMLDialogElement;
    export let confirmationInfo: ConfirmationInfo;

    let title: ConfirmationInfo['title'];
    let callback: ConfirmationInfo['callback'];
    let toastMessage: ConfirmationInfo['toastMessage'];

    /**
     * Updates title, callback, and toastMessage when confirmationInfo changes
     */
    $: if (confirmationInfo) {
        ({ title, callback, toastMessage } = confirmationInfo);
    }

    /**
     * Executes the callback, closes the modal dialog, and displays a success notification
     */
    function executeCallbackAndCloseModal() {
        callback();

        confirmationModalRef.close();

        if (toastMessage) notifySuccess(toastMessage);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:click={(event) => closeDialogOnOutsideClick(event, confirmationModalRef)}
    bind:this={confirmationModalRef}
    class="max-w-md p-0 border rounded-lg border-white/30 bg-white/5 backdrop:backdrop-blur-md backdrop:bg-black/70"
>
    <header
        class="grid items-center grid-flow-col gap-3 p-3 bg-white rounded-t-lg dark:bg-slate-700 dark:text-slate-200"
    >
        <Icon name="warning" size={22} />
        <h2 class="text-lg">{@html title}</h2>
    </header>

    <div class="flex justify-end gap-3 p-4 pt-8">
        <button
            type="button"
            on:click={() => confirmationModalRef.close()}
            class="p-2 px-4 transition bg-gray-600 rounded-md text-slate-100 hover:bg-gray-700"
            >Cancel</button
        >

        <button
            type="button"
            on:click={executeCallbackAndCloseModal}
            class="p-2 px-4 transition bg-gray-900 border-2 rounded-md border-violet-400/80 text-violet-500 hover:bg-violet-500 hover:text-white"
            >Confirm</button
        >
    </div>
</dialog>

<style lang="postcss">
    h2 {
        text-wrap: balance;
    }
</style>
