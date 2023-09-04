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
	let callback: ConfirmationInfo['callback'];

	/**
	 * Updates heading, callback when confirmationInfo changes
	 */
	$: if (confirmationInfo) {
		({ heading, subheading, callback } = confirmationInfo);
	}

	/**
	 * Executes the callback function, closes the modal, and handles notifications.
	 * @async
	 */
	async function executeCallbackAndCloseModal() {
		try {
			const result = await callback();

			confirmationModalRef.close();

			// Handle error case
			if (result.statusType === 'error') {
				notifyError(result.statusMessage, { target: 'dashboardLayout' });
				return;
			}

			await invalidateAll();

			notifySuccess(result.statusMessage, { target: 'dashboardLayout' });
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

		<Button type="button" variant="destructive" on:click={executeCallbackAndCloseModal}>
			Delete
		</Button>
	</footer>
</dialog>
