<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';
	import { notifySuccess } from '$dashboardUtils/toastUtils';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let confirmationModalRef: HTMLDialogElement;
	export let confirmationInfo: ConfirmationInfo;

	let heading: ConfirmationInfo['heading'];
	let subheading: ConfirmationInfo['subheading'];
	let toastMessage: ConfirmationInfo['toastMessage'];
	let callback: ConfirmationInfo['callback'];

	/**
	 * Updates heading, callback, and toastMessage when confirmationInfo changes
	 */
	$: if (confirmationInfo) {
		({ heading, subheading, toastMessage, callback } = confirmationInfo);
	}

	/**
	 * Executes the callback, closes the modal dialog, and displays a success notification
	 */
	async function executeCallbackAndCloseModal() {
		await callback();

		await invalidateAll();

		confirmationModalRef.close();

		if (toastMessage) notifySuccess(toastMessage, { target: 'dashboardLayout' });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	on:click={(event) => closeDialogOnOutsideClick(event, confirmationModalRef)}
	bind:this={confirmationModalRef}
    class='scaleInWithFadeKeyFrame'
>
	<header>
		<h3 class="text-xl">{heading}</h3>

		<p class="mt-1 text-sm text-muted-foreground">{@html subheading}</p>
	</header>

	<footer class="flex justify-end gap-3 mt-6">
		<Button type="button" variant="outline" on:click={() => confirmationModalRef.close()}>
			Cancel
		</Button>

		<Button type="button" on:click={executeCallbackAndCloseModal}>Confirm</Button>
	</footer>
</dialog>
