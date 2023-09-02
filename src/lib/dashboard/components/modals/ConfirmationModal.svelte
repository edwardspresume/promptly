<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';
	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';
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
	 * @async
	 */
	async function executeCallbackAndCloseModal() {
		try {
			const result = await callback();

			confirmationModalRef.close();

			// Handle error case
			if (result.statusType === 'error') {
				notifyError('Something went wrong. Please try again later.', { target: 'dashboardLayout' });
				return;
			}

			await invalidateAll();

			// Show success message if any
			if (toastMessage) {
				notifySuccess(toastMessage, { target: 'dashboardLayout' });
			}
		} catch (e) {
			console.error('Failed to execute callback and close modal');
			notifyError('An unexpected error occurred. Please try again.', { target: 'dashboardLayout' });
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	on:click={(event) => closeDialogOnOutsideClick(event, confirmationModalRef)}
	bind:this={confirmationModalRef}
	class="scaleInWithFadeKeyFrame"
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
